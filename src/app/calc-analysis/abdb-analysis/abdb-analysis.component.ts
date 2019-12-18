import {Component, Input, OnInit} from '@angular/core';
import {CalculationService} from '../../services/calculation.service';
import {DataService} from '../../services/data.service';
import {Column} from '../../app.interfaces';
import {CalcService} from '../../services/calc.service';

@Component({
   selector: 'app-abdb-analysis',
   templateUrl: './abdb-analysis.component.html',
   styleUrls: ['./abdb-analysis.component.sass']
})
export class AbdbAnalysisComponent implements OnInit {
   @Input() data: Column[];

   calcResults: any;

   AvsDBdata: any[];
   BvsDBdata: any[];

   constructor(
      private dataService: DataService,
      private calcService: CalcService
   ) {
   }

   ngOnInit() {
      this.getCalcResults();

      this.calcService.getSubsetsDistributions();
      this.AvsDBdata = this.calcService.getDataABvsDB('A');
      this.BvsDBdata = this.calcService.getDataABvsDB('B');
   }

   getCalcResults() {
      this.calcResults = this.dataService.calcABDB(this.data);
   }

   onSeSpChange(seSpConfig) {
      ['seMin', 'seMax', 'spMin', 'spMax'].forEach(v => {
         this.dataService[v] = seSpConfig[v];
      });

      this.getCalcResults();
   }

}
