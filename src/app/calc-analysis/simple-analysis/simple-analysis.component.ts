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
   @Input() normDays: number[];

   calc: {
      byDays: CalculationSimple,
      byNorm: CalculationSimple
   };

   constructor(
      private dataService: DataService,
      private calcService: CalculationService
   ) { }

   ngOnInit() {
      this.calc = {
         byDays: null,
         byNorm: null
      };
   }

   ngOnChanges(changes: SimpleChanges): void {
      console.log('changes: ', changes);

      if (this.data) {
         (this.calc.byDays as any) = {};
         this.calcDays();

         const calc = this.calc.byDays;
         calc.criteriaB = this.calcService.calculation2(calc.simulatedCohortA, calc.simulatedCohortB);
         calc.criteriaDistrB = this.dataService.buildIntDistributionWithNegatives(calc.criteriaB);
      }

      console.log('this.normDays: ', this.normDays);

      if (this.normDays && this.normDays.length) {
         (this.calc.byNorm as any) = {};
         this.calcNorm();

         const calc = this.calc.byNorm;
         calc.criteriaB = this.calcService.calculation2(calc.simulatedCohortA, calc.simulatedCohortB);
         calc.criteriaDistrB = this.dataService.buildIntDistributionWithNegatives(calc.criteriaB);
      }
   }

   calcDays() {
      [
         this.calc.byDays.daData,
         this.calc.byDays.dbData,
         this.calc.byDays.da,
         this.calc.byDays.db
      ] = this.dataService.getSubSetsTherapy(this.data);

      this.calc.byDays.simulatedCohortA =
         this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(this.calc.byDays.da));
      this.calc.byDays.simulatedCohortB =
         this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(this.calc.byDays.db));

      const daysData = this.dataService.getCol(this.data, 'days').data;

      this.calc.byDays.simulatedCohortTotal =
         this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(daysData));

      this.calc.byDays.simulatedCohortDistrA = this.dataService.buildDistribution(this.calc.byDays.simulatedCohortA);
      this.calc.byDays.simulatedCohortDistrB = this.dataService.buildDistribution(this.calc.byDays.simulatedCohortB);
      this.calc.byDays.simulatedCohortDistrTotal = this.dataService.buildDistribution(this.calc.byDays.simulatedCohortTotal);
   }

   calcNorm() {
      [
         this.calc.byNorm.daData,
         this.calc.byNorm.dbData,
         this.calc.byNorm.da,
         this.calc.byNorm.db
      ] = this.dataService.getSubSetsTherapy(this.data, this.normDays);

      [
         this.calc.byNorm.simulatedCohortDistrA,
         this.calc.byNorm.simulatedCohortA
      ] = this.calcService.normSimulation(this.calc.byNorm.daData, this.calc.byNorm.da);

      [
         this.calc.byNorm.simulatedCohortDistrB,
         this.calc.byNorm.simulatedCohortB
      ] = this.calcService.normSimulation(this.calc.byNorm.dbData, this.calc.byNorm.db);

      [
         this.calc.byNorm.simulatedCohortDistrTotal,
         this.calc.byNorm.simulatedCohortTotal
      ] = this.calcService.normSimulation(this.data, this.normDays);
   }
}

interface CalculationSimple {
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
