import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ColAddMode, Column} from '../app.interfaces';
import {ColumnAdderComponent} from './column-adder/column-adder.component';

@Component({
   selector: 'app-data-viewer',
   templateUrl: './data-viewer.component.html',
   styleUrls: ['./data-viewer.component.sass']
})
export class DataViewerComponent implements OnInit, OnChanges, AfterViewInit {

   @Input() fileData: string[][];
   @ViewChild(ColumnAdderComponent, {static: false}) columnAdder: ColumnAdderComponent;
   @Output() workDataChange = new EventEmitter<Column[]>();

   selectedCol: Column;
   addedColumns: Column[];
   titles: string[];
   addingMode: ColAddMode;
   showWorkTable: boolean;
   isWithNormConfig: boolean;
   normConfig: any;
   showNormDays: boolean;
   workData: Column[];
   normDays: number[] = [];

   indicatorDays = [0, 5, 14];

   constructor() { }

   ngOnInit() {
   }

   ngAfterViewInit(): void {
      this.columnAdder.addColChange.subscribe(c => {
         this.addedColumns = c;
      });

      this.columnAdder.finishAdding.subscribe(() => {
         this.showWorkTable = true;
      });
   }

   ngOnChanges(changes: SimpleChanges): void {
      const fileData = changes.fileData.currentValue;
      if (fileData) {
         this.titles = fileData.shift();
      }
   }

   selectColumn(i: number) {
      this.selectedCol = {
         data: this.fileData.map(x => x[i]),
         meta: {
            title: this.titles[i],
            type: this.addingMode
         }
      };
   }

   onAddingModeChange(addingMode) {
      this.addingMode = addingMode;
   }

   fixateWorkData(workData: Column[]) {
      this.workData = workData;
      this.workDataChange.emit(workData);

      if (workData.some(col => col.meta.type === 'indicator')) {
         this.normConfig = [];

         workData.forEach(col => {
            if (col.meta.type === 'indicator') {
               if (!this.normConfig.some(indicator => indicator.id === col.meta.observation.id)) {
                  this.normConfig.push({
                     id: col.meta.observation.id,
                     title: col.meta.title,
                  });
               }
            }
         });

         this.isWithNormConfig = true;
      }
   }

   recalcNormDays(normConfig) {
      console.log('normConfig: ', normConfig);
      console.log('this.workData: ', this.workData);

      this.normDays = [];

      this.workData[0].data.forEach((v, i) => {
         let normDay = NaN;
         let indicatorDayCol: Column;

         this.indicatorDays.some(d => {
            let isNorm = true;

            this.normConfig.forEach(indicator => {
               indicatorDayCol = this.workData.find(col => {
                  return col.meta.observation.id === indicator.id && col.meta.observation.day === d;
               });

               isNorm = isNorm && (!!indicatorDayCol.data[i] === indicator.normConfig);
            });

            if (isNorm) {
               normDay = d;
               return true;
            }
         });

         this.normDays.push(normDay);
      });

      console.log('this.normDays: ', this.normDays);
   }
}
