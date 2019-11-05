import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Chart} from 'highcharts';
import {ChartsService} from '../charts.service';
import {ChartTitles} from '../../app.interfaces';

@Component({
   selector: 'app-stacked-percentage-chart',
   templateUrl: './stacked-percentage-chart.component.html',
   styleUrls: ['./stacked-percentage-chart.component.sass']
})
export class StackedPercentageChartComponent implements OnInit, OnChanges {
   @Input() data: any;
   @Input() categories: string[] = ['до лікування', 'через 3-7 діб', 'через 14 діб'];
   @Input() titles: ChartTitles;

   Highcharts: typeof Highcharts;
   barChartOptions: Highcharts.Options;
   chart: Chart;
   updateFlag: boolean;
   showChart: boolean;

   constructor(
      private chartService: ChartsService,
      private cdr: ChangeDetectorRef
   ) {
      this.Highcharts = chartService.Highcharts;
      this.barChartOptions = {
         chart: {
            type: 'column',
         },

         colors: ['#87d8af', '#fdcb5a', '#ee6b69'],

         legend: {
            // enabled: false
         },

         tooltip: {
            valueDecimals: 3
         },

         yAxis: {
            title: {
               text: 'частка пацієнтів'
            },
            labels: {
               formatter: function() {
                  return (this.value / 100).toString();
               }
            }
         },

         plotOptions: {
            column: {
               stacking: 'percent'
            }
         },
      };
   }

   ngOnInit() {

   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.data) {
         this.barChartOptions.series = this.data;
      }

      if (this.categories) {
         this.barChartOptions.xAxis = {
            categories: this.categories
         };
      }

      if (this.data && this.categories) {
         this.showChart = true;
      }
   }

}
