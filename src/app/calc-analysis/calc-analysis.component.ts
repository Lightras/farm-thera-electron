import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {Column} from '../app.interfaces';
import {MockService} from '../services/mock.service';
import {CalculationService} from '../services/calculation.service';
import {CalcService} from '../services/calc.service';

@Component({
   selector: 'app-calc-analysis',
   templateUrl: './calc-analysis.component.html',
   styleUrls: ['./calc-analysis.component.sass']
})
export class CalcAnalysisComponent implements OnInit {

   workData: Column[];
   normConfig: any[] = [];
   isWithNormConfig: boolean;
   normDays: number[];
   noVirusData = true;

   scatterCtc: any[];

   constructor(
      private dataService: DataService,
      private mockService: MockService,
      private calculationService: CalculationService,
   ) {
      this.workData = dataService.workData;
   }

   ngOnInit() {
      // this.mockService.getMockData('RVI_novorozhdennykh').subscribe(d => {
      this.mockService.getMockData('RVI_Indonesia_2').subscribe(d => {
      // this.mockService.getMockData('Nehospit_pnevmonii').subscribe(d => {
         this.workData = d;
         this.normConfig = [];

         this.dataService.workData = this.workData;
         // this.scatterCtc = this.calcService.getScatterCtC();

         this.workData.forEach(col => {
            if (col.meta.type === 'virus') {
               this.noVirusData = false;

            } else if (col.meta.type === 'indicator') {
               this.isWithNormConfig = true;

               if (!this.normConfig.some(indicator => indicator.id === col.meta.observation.id)) {
                  this.normConfig.push({
                     id: col.meta.observation.id,
                     title: col.meta.title,
                     normConfig: false
                  });
               }
            }
         });
      });
   }

   recalcNormDays(normConfig: any[]) {
      this.normDays = this.calculationService.recalcNormDays(normConfig, this.workData);
   }
}
