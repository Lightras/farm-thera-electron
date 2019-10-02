import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BarData, ChartTitles} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarOptions} from 'highcharts';

@Component({
   selector: 'app-continuous-bar-chart',
   templateUrl: './continuous-bar-chart.component.html',
   styleUrls: ['./continuous-bar-chart.component.sass']
})
export class ContinuousBarChartComponent implements OnInit, OnChanges {
   @Input() data: number[];
   @Input() titles: ChartTitles;
   @Input() bins: number;

   Highcharts: typeof Highcharts;
   barChartOptions: Highcharts.Options;
   chart: Chart;
   updateFlag: boolean;
   showChart: boolean;
   barData: any;

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
      if (this.data && this.bins) {
         const barData = this.convertData(changes.data.currentValue);
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

   convertData(data: number[]): {x: number, y: number}[] {
      const convertedData: {x: number, y: number}[] = [];
      const dataFiltered = data.filter(v => !isNaN(v));
      const min = Math.min(...dataFiltered);
      const max = Math.max(...dataFiltered);
      const binStep = (max - min) / this.bins;
      let currentBin = min;
      let nextBin = min + binStep;
      let dataPoint;

      for (let i = 1; i <= this.bins; i++) {
         dataPoint = dataFiltered.reduce((acc, n) => {
            if (n >= currentBin && n < nextBin) {
               return ++acc;
            } else {
               return acc;
            }
         }, 0);

         convertedData.push({
            x: currentBin,
            y: dataPoint
         });

         currentBin = nextBin;
         nextBin += binStep;
      }

      return convertedData;
   }

}
