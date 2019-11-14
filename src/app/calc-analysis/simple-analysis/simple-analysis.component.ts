import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {CalculationService} from '../../services/calculation.service';


@Component({
   selector: 'app-simple-analysis',
   templateUrl: './simple-analysis.component.html',
   styleUrls: ['./simple-analysis.component.sass']
})
export class SimpleAnalysisComponent implements OnInit, OnChanges {
   @Input() data: Column[];

   calc: CalculationSimple;

   constructor(
      private dataService: DataService,
      private calcService: CalculationService
   ) { }

   ngOnInit() {

   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.data) {
         (this.calc as any) = {};
         this.calcDays();

         const calc = this.calc;
         calc.criteriaB = this.calcService.calculation2(calc.simulatedCohortA, calc.simulatedCohortB);
         calc.criteriaDistrB = this.dataService.buildIntDistributionWithNegatives(calc.criteriaB);

         this.calcService.daysVsNorm.byDays = this.calc;
      }
   }

   calcDays() {
      [
         this.calc.daData,
         this.calc.dbData,
         this.calc.da,
         this.calc.db
      ] = this.dataService.getSubSetsTherapy(this.data);

      this.calc.simulatedCohortA =
         this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(this.calc.da));
      this.calc.simulatedCohortB =
         this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(this.calc.db));

      const daysData = this.dataService.getCol(this.data, 'days').data;

      this.calc.simulatedCohortTotal =
         this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(daysData));

      this.calc.simulatedCohortDistrA = this.dataService.buildDistribution(this.calc.simulatedCohortA);
      this.calc.simulatedCohortDistrB = this.dataService.buildDistribution(this.calc.simulatedCohortB);
      this.calc.simulatedCohortDistrTotal = this.dataService.buildDistribution(this.calc.simulatedCohortTotal);
   }
}

export interface CalculationSimple {
   da: number[];
   db: number[];
   daData: Column[];
   dbData: Column[];
   criteriaB: number[];
   criteriaDistrB: number[];
   simulatedCohortA: number[];
   simulatedCohortDistrA: number[];
   simulatedCohortB: number[];
   simulatedCohortDistrB: number[];
   simulatedCohortTotal: number[];
   simulatedCohortDistrTotal: number[];
}
