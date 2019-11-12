import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BasicChartData, ChartTitles} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarDataOptions, SeriesBarOptions} from 'highcharts';
import * as Z from 'zebras';

@Component({
   selector: 'app-multi-bar-chart',
   templateUrl: './multi-bar-chart.component.html',
   styleUrls: ['./multi-bar-chart.component.sass']
})
export class MultiBarChartComponent implements OnInit, OnChanges {
   @Input() barData: BasicChartData[];
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
            width: 1200,
            zoomType: 'x'
         },

         legend: {
            enabled: false
         },

         tooltip: {
            valueDecimals: 3
         },

         plotOptions: {
            column: {
               pointWidth: 5,
               pointPadding: 0.5
            }
         }
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.barData && changes.barData.currentValue) {
         this.barChartOptions.series = [] as SeriesBarOptions[];
         this.barData.forEach(barData => {
            this.barChartOptions.series.push({data: barData} as SeriesBarOptions);
         });

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

