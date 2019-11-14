import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {CalculationService} from '../../services/calculation.service';
import {CalculationSimple} from '../simple-analysis/simple-analysis.component';

@Component({
  selector: 'app-simple-analysis-norm',
  templateUrl: './simple-analysis-norm.component.html',
  styleUrls: ['./simple-analysis-norm.component.sass']
})
export class SimpleAnalysisNormComponent implements OnInit, OnChanges {
   @Input() data: Column[];
   @Input() normDays: number[];

   calc: CalculationSimple;

   constructor(
      private dataService: DataService,
      private calcService: CalculationService
   ) { }

   ngOnInit() {

   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.data && this.normDays && this.normDays.length) {
         (this.calc as any) = {};
         this.calcNorm();

         const calc = this.calc;
         calc.criteriaB = this.calcService.calculation2(calc.simulatedCohortA, calc.simulatedCohortB);
         calc.criteriaDistrB = this.dataService.buildIntDistributionWithNegatives(calc.criteriaB);

         this.calcService.daysVsNorm.byNorm = this.calc;
         this.calcService.fixNormSimulation();
      }
   }

   calcNorm() {
      [
         this.calc.daData,
         this.calc.dbData,
         this.calc.da,
         this.calc.db
      ] = this.dataService.getSubSetsTherapy(this.data, this.normDays);

      [
         this.calc.simulatedCohortDistrA,
         this.calc.simulatedCohortA
      ] = this.calcService.normSimulation(this.calc.daData, this.calc.da);

      [
         this.calc.simulatedCohortDistrB,
         this.calc.simulatedCohortB
      ] = this.calcService.normSimulation(this.calc.dbData, this.calc.db);

      [
         this.calc.simulatedCohortDistrTotal,
         this.calc.simulatedCohortTotal
      ] = this.calcService.normSimulation(this.data, this.normDays);
   }
}
