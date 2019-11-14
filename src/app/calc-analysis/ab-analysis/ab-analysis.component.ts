import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import {DataService} from '../../services/data.service';

@Component({
   selector: 'app-ab-analysis',
   templateUrl: './ab-analysis.component.html',
   styleUrls: ['./ab-analysis.component.sass']
})
export class AbAnalysisComponent implements OnInit, OnChanges {
   @Input() data: Column[];

   dnaDistr: number[];
   dvaDistr: number[];
   dnbDistr: number[];
   dvbDistr: number[];

   calc: any;

   constructor(
      private dataService: DataService
   ) { }

   ngOnInit() {

   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.data && changes.data.currentValue) {
         [this.calc, this.dnaDistr, this.dvaDistr, this.dnbDistr, this.dvbDistr] = this.dataService.calcAB(this.data);
      }
   }

}
