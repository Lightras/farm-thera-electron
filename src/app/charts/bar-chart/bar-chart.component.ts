import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BarData, ChartTitles} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarOptions} from 'highcharts';
import * as Z from 'zebras';

@Component({
   selector: 'app-bar-chart',
   templateUrl: './bar-chart.component.html',
   styleUrls: ['./bar-chart.component.sass']
})
export class BarChartComponent implements OnInit, OnChanges {
   @Input() barData: BarData;
   @Input() titles: ChartTitles;
   @Input() cumulative = false;

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

         legend: {
            enabled: false
         },

         tooltip: {
            valueDecimals: 3
         }
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.barData && changes.barData.currentValue) {
         const barData = this.cumulative ? Z.cumulative(Z.sum, this.barData) : this.barData;
         console.log('barData: ', barData);

         const barSeriesData = barData.map((v, i) => ({x: i, y: v}));
         console.log('barSeriesData: ', barSeriesData);

         this.barChartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

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
