import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartForemotherComponent} from '../chart-foremother/chart-foremother.component';
import * as Highcharts from 'highcharts';
import {ChartsService} from '../charts.service';
import {SeriesColumnOptions} from 'highcharts';

@Component({
   selector: 'app-success-bar-chart',
   templateUrl: '../chart-foremother/chart-foremother.component.html',
   styleUrls: ['./success-bar-chart.component.sass']
})
export class SuccessBarChartComponent extends ChartForemotherComponent implements OnInit, OnChanges {
   @Input() bins: number;
   chartOptions: Highcharts.Options;

   constructor(
      chartService: ChartsService,
      cdr: ChangeDetectorRef
   ) {
      super(chartService, cdr);

      this.chartOptions = {
         chart: {
            type: 'column'
         },

         legend: {
            enabled: false
         },

         tooltip: {
            valueDecimals: 3
         },

         series: [{
            data: []
         } as SeriesColumnOptions]
      };
   }


   ngOnInit() {

   }

   ngOnChanges(changes: SimpleChanges): void {
      super.ngOnChanges(changes);

      if (this.data) {
         (this.chartOptions.series[0] as SeriesColumnOptions).data = this.data;
         this.updateFlag = true;
         this.showChart = true;
      }
   }

}
