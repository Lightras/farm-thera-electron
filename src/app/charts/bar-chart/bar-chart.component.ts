import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BarData, ChartTitles} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarOptions, SeriesLineOptions, YAxisOptions} from 'highcharts';
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
   @Input() normalized = false;
   @Input() withCumulativeLine = true;

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
         console.log('this.barData: ', this.barData);
         let barData;

         if (!this.barData[0].x) {
            this.barData = this.barData.map((v, i) => ({x: i, y: v}));
         }
         barData = this.cumulative ? Z.cumulative(Z.sum, this.barData) : this.barData;

         const cumulativeLineData = [];

         if (this.normalized) {
            const sum = this.barData.reduce((accum, v) => accum + v.y, 0);
            barData = barData.map(v => ({x: v.x, y: v.y / sum}));
         }

         this.barChartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

         if (this.withCumulativeLine) {
            barData.forEach((v, i) => {
               cumulativeLineData.push(i ? {x: v.x, y: v.y + cumulativeLineData[i - 1].y} : v);
            });
            console.log('cumulativeLineData: ', cumulativeLineData);

            this.barChartOptions.yAxis = [
               {},
               {
                  opposite: true,
                  title: {
                     text: 'Кумулятивна ймовірність'
                  }
               }
            ];

            this.barChartOptions.series.push({
               type: 'line',
               data: cumulativeLineData,
               yAxis: 1,
               marker: {
                  enabled: false
               }
            } as SeriesLineOptions);
         }

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
