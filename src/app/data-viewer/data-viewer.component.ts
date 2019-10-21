import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {CalcResults2, ColAddMode, Column} from '../app.interfaces';
import {ColumnAdderComponent} from './column-adder/column-adder.component';
import {DataService} from '../data.service';
import * as Z from 'zebras';
import {max} from 'rxjs/operators';
import {CalculationService} from '../calculation.service';

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
   simulatedCohortDistrA: number[];
   simulatedCohortDistrB: number[];
   criteriaDistrB: number[];

   normCalcResults: {
      byNorm: CalcResults2,
      byDays: CalcResults2
   };

   constructor(
      private calcService: CalculationService,
      private dataService: DataService
   ) { }

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
                     normConfig: false
                  });
               }
            }
         });

         this.isWithNormConfig = true;
      }
   }

   performCalc(normConfig) {
      this.normDays = this.recalcNormDays(normConfig, this.workData);

      this.normCalcResults = {
         byDays: this.getCalcResults(this.workData, this.normDays, 'days'),
         byNorm: this.getCalcResults(this.workData, this.normDays, 'norm'),
      };

      console.log('this.normCalcResults: ', this.normCalcResults);
   }

   getCalcResults(data: Column[], normDays: number[], type: 'norm' | 'days'): CalcResults2 {
      const calcResults: CalcResults2 = {
         normDays: null,
         daData: null,
         dbData: null,
         da: null,
         db: null,
         simulatedCohortTotal: null,
         simulatedCohortDistrTotal: null,
         simulatedCohortA: null,
         simulatedCohortB: null,
         simulatedCohortDistrA: null,
         simulatedCohortDistrB: null,
         criteriaB: null,
         criteriaDistrB: null,
      };

      if (type === 'days') {
         normDays = this.dataService.getCol(data, 'days').data;
      }

      [
         calcResults.daData,
         calcResults.dbData,
         calcResults.da,
         calcResults.db
      ] = this.calcService.getSubSetsTherapy(data, normDays);

      if (type === 'norm') {
         [calcResults.simulatedCohortDistrA, calcResults.simulatedCohortA] = this.normSimulation(calcResults.daData, calcResults.da);
         [calcResults.simulatedCohortDistrB, calcResults.simulatedCohortB] = this.normSimulation(calcResults.dbData, calcResults.db);
         [calcResults.simulatedCohortDistrTotal, calcResults.simulatedCohortTotal] = this.normSimulation(data, normDays);
      } else {

         calcResults.simulatedCohortA =
            this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(calcResults.da));
         calcResults.simulatedCohortB =
            this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(calcResults.db));
         calcResults.simulatedCohortTotal =
            this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(normDays));

         calcResults.simulatedCohortDistrA = this.dataService.buildDistribution(calcResults.simulatedCohortA);
         calcResults.simulatedCohortDistrB = this.dataService.buildDistribution(calcResults.simulatedCohortB);
         calcResults.simulatedCohortDistrTotal = this.dataService.buildDistribution(calcResults.simulatedCohortTotal);
      }

      calcResults.criteriaB = this.calcService.calculation2(calcResults.simulatedCohortA, calcResults.simulatedCohortB);
      calcResults.criteriaDistrB = this.dataService.buildIntDistributionWithNegatives(calcResults.criteriaB);

      return calcResults;
   }

   recalcNormDays(normConfig, dataSet) {
      const normDays = [];

      dataSet[0].data.forEach((v, i) => {
         let normDay = NaN;
         let indicatorDayCol: Column;

         this.indicatorDays.some(d => {
            let isNorm = true;

            this.normConfig.forEach(indicator => {
               if (indicator.normConfig) {
                  indicatorDayCol = dataSet.find(col => {
                     return col.meta.observation.id === indicator.id && col.meta.observation.day === d;
                  });

                  isNorm = isNorm && !!indicatorDayCol.data[i];
               }
            });

            if (isNorm) {
               normDay = d;
               return true;
            }
         });

         normDays.push(normDay);
      });

      return normDays;
   }

   normSimulation(dataSet, normDays) {
      console.log('dataSet: ', dataSet);
      const daysCol = dataSet.find(col => col.meta.type === 'days');
      console.log('daysCol: ', daysCol);
      const maxDays = Z.max(daysCol.data);
      const counts = Z.valueCounts(normDays);
      const countsArray = [0, 5, 14, maxDays].map(d => {
         return {
            day: d,
            count: (d === maxDays) ? counts.NaN : counts[d] || 0,
            cumCount: 0
         };
      });
      countsArray.sort((a, b) => a.day - b.day);
      countsArray.forEach((v, i) => {
         if (i) {
            v.cumCount = countsArray[i - 1].cumCount + v.count;
         } else {
            v.cumCount = v.count;
         }
      });

      [0, 5, 14, maxDays].forEach(d => {
         if (typeof counts[d] === 'undefined') {
            if ([0, 5, 14].includes(d)) {
               counts[d] = 0;
            } else {
               counts[d] = counts.NaN;
            }
         }
      });

      console.log('maxDays: ', maxDays);

      const simulatedDistribution = Array(maxDays);
      countsArray.forEach((c, i) => {
         simulatedDistribution[c.day] = c.cumCount;

         let leap;
         let daysDiff;
         let step;

         if (countsArray[i + 1]) {
            leap = countsArray[i + 1].count;
            daysDiff = countsArray[i + 1].day - countsArray[i].day;
            step = leap / (daysDiff);

            for (let j = 0; j < daysDiff; j++) {
               if (j) {
                  simulatedDistribution[c.day + j] = c.cumCount + step * j;
               }
            }
         }
      });

      // this.simulatedDistribution = simulatedDistribution;
      const simulatedCohort = this.calcService.randomizeFromDistribution(simulatedDistribution, this.dataService.sampleSize, true);
      const simulatedCohortValueCounts = Z.valueCounts(simulatedCohort);
      const simulatedCohortMaxValue = Z.max(simulatedCohort);
      const simulatedCohortDistr = [];
      for (let i = 0; i <= simulatedCohortMaxValue; i++) {
         simulatedCohortDistr.push(simulatedCohortValueCounts[i] ? simulatedCohortValueCounts[i] : 0);
      }
      // this.simulatedCohortDistr = simulatedCohortDistr;

      return [simulatedCohortDistr, simulatedCohort];
   }
}
