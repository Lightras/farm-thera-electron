import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartTitles} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarOptions, SeriesLineOptions} from 'highcharts';
import * as Z from 'zebras';
import {ChartForemotherComponent} from '../chart-foremother/chart-foremother.component';

@Component({
   selector: 'app-continuous-bar-chart',
   templateUrl: '../chart-foremother/chart-foremother.component.html',
   styleUrls: ['./continuous-bar-chart.component.sass']
})
export class ContinuousBarChartComponent extends ChartForemotherComponent implements OnInit, OnChanges {
   @Input() bins: number;
   @Input() normalized: boolean;
   @Input() cutPercent: number;
   @Input() threshold: number;
   @Input() debug: boolean;
   @Input() withCumulativeLine = true;

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
         }
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      super.ngOnChanges(changes);

      this.showChart = false;

      if (this.data && this.bins) {
         let barData = this.convertData(changes.data.currentValue);
         if (this.normalized) {
            barData = barData.map(d => {
               const sum = barData.reduce((acc, n) => acc + n.y, 0);
               return {x: d.x, y: d.y / sum};
            });
         }

         if (this.threshold) {
            barData = barData.filter(v => v.y >= this.threshold);
         }

         this.chartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

         if (this.withCumulativeLine) {
            const cumulativeLineData = [];
            barData.forEach((v, i) => {
               cumulativeLineData.push(i ? {x: v.x, y: v.y + cumulativeLineData[i - 1].y} : v);
            });

            this.chartOptions.yAxis = [
               {},
               {
                  opposite: true,
                  title: {
                     text: 'Кумулятивна ймовірність'
                  }
               }
            ];

            this.chartOptions.series.push({
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
   }

   convertData(data: number[]): {x: number, y: number}[] {
      const convertedData: {x: number, y: number}[] = [];
      let dataFiltered = data.filter(v => !isNaN(v));

      if (this.cutPercent) {
         dataFiltered = dataFiltered.filter(v => v < 12 && v > -12);
      }

      if (this.debug) {
         // console.log('dataFiltered: ', dataFiltered);
         // console.log('Середнє: ', Z.mean(dataFiltered));
         // const negativeCount =  dataFiltered.reduce((negCount, v) => v < 0 ? ++negCount : negCount, 0);
         // console.log('negativeCount: ', negativeCount / 10000);
         // console.log('max: ', Z.max(dataFiltered));
      }


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
