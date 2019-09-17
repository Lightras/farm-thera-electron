import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../app.interfaces';

@Component({
   selector: 'app-calculation',
   templateUrl: './calculation.component.html',
   styleUrls: ['./calculation.component.sass']
})
export class CalculationComponent implements OnInit, OnChanges {
   @Input() workData: Column[];

   constructor() { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.workData && changes.workData.currentValue) {
         console.log('this.workData calc: ', this.workData);
      }
   }

   getSubsets(data) {

   }

}
