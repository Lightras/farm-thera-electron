import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartForemotherComponent} from '../chart-foremother/chart-foremother.component';

@Component({
   selector: 'app-continuous-column-chart',
   templateUrl: '../chart-foremother/chart-foremother.component.html',
   styleUrls: ['./continuous-column-chart.component.sass']
})
export class ContinuousColumnChartComponent extends ChartForemotherComponent implements OnInit, OnChanges {


   ngOnInit() {
      super.ngOnInit();
   }

   ngOnChanges(changes: SimpleChanges): void {
      super.ngOnChanges(changes);
   }

}
