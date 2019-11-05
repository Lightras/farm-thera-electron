import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BarData, ChartTitles} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarOptions, SeriesColumnOptions} from 'highcharts';
import * as Z from 'zebras';

@Component({
   selector: 'app-categories-bar-chart',
   templateUrl: './categories-bar-chart.component.html',
   styleUrls: ['./categories-bar-chart.component.sass']
})
export class CategoriesBarChartComponent implements OnInit, OnChanges {
   @Input() barData: BarData;
   @Input() titles: ChartTitles;
   @Input() categories: string[];

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
            type: 'column'
         },

         plotOptions: {
            column: {
               dataLabels: {
                  enabled: true,
                  // tslint:disable-next-line:only-arrow-functions
                  formatter: function() {
                     return this.y + ' %';
                  }
               }
            }
         },

         legend: {
            enabled: false
         },

         tooltip: {
            valueDecimals: 3
         },

         xAxis: [{
            labels: {
               rotation: -50,
               y: 10,
               align: 'right'
            }
         }]
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.barData && changes.barData.currentValue) {
         const sum = this.barData.reduce((accum, n) => accum + n, 0);
         const barData = this.barData.map(n => parseFloat((n * 100 / sum).toFixed(1)))
                                     .sort((a, b) => b - a);

         this.barChartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

         this.barChartOptions.xAxis[0].categories = this.categories;

         this.showChart = true;
      }

      if (changes.titles && changes.titles) {
         this.cdr.detectChanges();
         this.chart.setTitle({
            text: this.titles.chartTitle
         });

         this.chart.xAxis[0].update({
            title: {
               text: this.titles.xAxisTitle
            }
         });

         this.chart.yAxis[0].update({
            title: {
               text: this.titles.yAxisTitle
            }
         });
      }
   }

}
