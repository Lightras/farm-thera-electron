import { Component, OnInit } from '@angular/core';
import {CalculationService} from '../../services/calculation.service';
import {DataService} from '../../services/data.service';

@Component({
   selector: 'app-abdb-analysis',
   templateUrl: './abdb-analysis.component.html',
   styleUrls: ['./abdb-analysis.component.sass']
})
export class AbdbAnalysisComponent implements OnInit {
   calcResults: any;

   constructor(
      private dataService: DataService
   ) {
   }

   ngOnInit() {
      this.calcResults = this.dataService.fullCalc;
   }

}
