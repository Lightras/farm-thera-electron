import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColAddMode, Column, Indicators} from '../../app.interfaces';
import * as Z from 'zebras';
import {isNull} from 'util';

@Component({
   selector: 'app-column-adder',
   templateUrl: './column-adder.component.html',
   styleUrls: ['./column-adder.component.sass']
})
export class ColumnAdderComponent implements OnInit, OnChanges {
   @Input() selectedCol: Column;

   @Output() addColChange: EventEmitter<Column[]> = new EventEmitter<Column[]>();
   @Output() addingModeChange: EventEmitter<ColAddMode> = new EventEmitter<ColAddMode>();
   @Output() finishAdding: EventEmitter<any> = new EventEmitter<any>();

   columnTypes: ColAddMode[] = ['days', 'virus', 'therapy', 'indicator'];
   addingMode: ColAddMode;
   colTitle: string;
   columnForAdding: Column;
   indicatorColumnsForAdding: Column[] = [];

   minDays: number;
   maxDays: number;
   uniqueValues: any[];
   indicators: Indicators = {
      days: [0, 5, 14],
      ids: [],
      indicators: []
   };

   currentIndicatorDay: number;
   showValuesInterpretation: boolean;
   minIndicatorValue: number;
   maxIndicatorValue: number;
   boundaryIndicatorValue: number;
   isIndicatorNormHigher: boolean;

   constructor() { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.selectedCol && changes.selectedCol.currentValue) {

         switch (this.addingMode) {
            case 'days': {
               this.colTitle = this.selectedCol.meta.title;

               this.columnForAdding = {
                  data: this.selectedCol.data.map(x => parseInt(x, 10)),
                  meta: this.selectedCol.meta
               };

               this.minDays = Math.min(...this.columnForAdding.data);
               this.maxDays = Math.max(...this.columnForAdding.data);

               break;
            }

            case 'virus':
            case 'therapy': {
               this.colTitle = this.selectedCol.meta.title;

               this.uniqueValues = [...(new Set(this.selectedCol.data)).values()].sort().map(
                  x => ({
                     value: x,
                     translateValue: null
                  })
               );

               break;
            }

            case 'indicator': {
               const currentDay = this.indicatorColumnsForAdding.find(d => d.meta.observation.day === this.currentIndicatorDay);
               currentDay.meta.observation.title = this.selectedCol.meta.title;
               currentDay.data = this.selectedCol.data.map(x => parseInt(x, 10));

               console.log('this.indicatorColumnsForAdding: ', this.indicatorColumnsForAdding);
               if (this.indicatorColumnsForAdding.every(col => !!col.data)) {
                  this.showValuesInterpretation = true;

                  const allValues = this.indicatorColumnsForAdding.reduce((allVals, col) => allVals.concat(col.data), []);
                  this.uniqueValues = Z.unique(allValues).map(x => ({
                     value: x,
                     translatedValue: null
                  }));

                  this.minIndicatorValue = Z.min(allValues);
                  this.maxIndicatorValue = Z.max(allValues);
               } else {
                  this.showValuesInterpretation = false;
               }


               break;
            }
         }
      }
   }

   finishAddingMode() {
      this.finishAdding.emit();
   }

   getNewIndicatorId(): number {
      if (this.indicators.ids.length === 0) {
         this.indicators.ids.push(0);
         return 0;
      } else {
         const lastId = this.indicators.ids.slice(-1)[0];
         this.indicators.ids.push(lastId + 1);
         return lastId + 1;
      }
   }

   translateValue(i, translation) {
      this.uniqueValues[i].translateValue = translation;
   }

   startAddingColumn(colType: ColAddMode) {
      this.addingMode = colType;

      switch (this.addingMode) {
         case 'days': {
            this.colTitle = 'Кількість ліжко-днів';
            break;
         }

         case 'virus': {
            this.colTitle = 'Наявність вірусу';
            break;
         }

         case 'therapy': {
            this.colTitle = 'Препарат';
            break;
         }

         case 'indicator': {
            this.colTitle = 'Показник';
            const indicatorId = this.getNewIndicatorId();

            this.indicatorColumnsForAdding = this.indicators.days.map(d => ({
               data: null,
               meta: {
                  title: '',
                  type: 'indicator',
                  observation: {
                     id: indicatorId,
                     day: d,
                     title: ''
                  }
               }
            }));

            break;
         }
      }
   }

   cancelAddingColumn() {
      this.addingMode = null;
      this.indicatorColumnsForAdding = [];
   }

   addColumn() {
      if (this.addingMode === 'virus' || this.addingMode === 'therapy') {
         this.columnForAdding = {
            data: this.selectedCol.data.map(x => this.uniqueValues.find(v => v.value === x).translateValue),
            meta: {
               title: this.colTitle,
               type: null
            }
         };
      } else if (this.addingMode === 'indicator') {
         this.indicatorColumnsForAdding.forEach(c => {
            c.meta.title = this.colTitle;
            c.meta.norm = {
               boundaryValue: this.boundaryIndicatorValue,
               isGreaterThanBoundary: !!this.isIndicatorNormHigher
            };
            c.data = c.data.map(x => this.translateNorm(x, c.meta.norm.boundaryValue, c.meta.norm.isGreaterThanBoundary));
         });
         this.addColChange.emit(this.indicatorColumnsForAdding);
         this.cancelAddingColumn();
         return;
      }

      this.columnForAdding.meta.type = this.addingMode;
      this.addColChange.emit([this.columnForAdding]);
      this.columnForAdding = null;
      this.cancelAddingColumn();
   }

   translateNorm(value: number, boundaryValue: number, isGreaterThanBoundary: boolean): number {
      let isNorm;
      if (value === boundaryValue) {
         isNorm = true;
      } else {
         // @ts-ignore
         // tslint:disable-next-line:no-bitwise
         isNorm = !((value > boundaryValue) ^ isGreaterThanBoundary);
      }

      return Number(isNorm);
   }

   selectIndicatorCol(indicatorDay: number) {
      this.currentIndicatorDay = indicatorDay;
   }

   removeIndicatorCol(indicatorDay: number) {
      const currentDay = this.indicatorColumnsForAdding.find(c => c.meta.observation.day === indicatorDay);
      currentDay.data = null;
      currentDay.meta.observation.title = '';
   }
}
