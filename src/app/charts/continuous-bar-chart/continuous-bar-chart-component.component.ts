import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {PlotLineLabelOptions, SeriesBarOptions, SeriesLineOptions} from 'highcharts';
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
   @Input() realityBounds: number[] = [];

   chartOptions: Highcharts.Options;
   realityBoundsPoints: any[] = [];
   mean: number;
   specialColor = 'red';

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
            const sum = barData.reduce((acc, n) => acc + n.y, 0);
            barData = barData.map(d => {
               return {x: d.x, y: d.y / sum};
            });
         }

         this.mean = barData.reduce((expected, v) => expected + v.x * v.y, 0);

         if (this.threshold) {
            barData = barData.filter(v => v.y >= this.threshold);
         }

         this.chartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

         this.chartOptions.xAxis = [
            {
               plotLines: [
                  {
                     value: this.mean,
                     color: 'red',
                     zIndex: 10,
                     width: 2,
                     label: {
                        formatter() {
                          return (this.options.value).toFixed(3);
                        },
                        style: {
                           color: 'red',
                           fontWeight: 'bold',
                        },
                        rotation: 0
                     } as PlotLineLabelOptions
                  }
               ]
            }
         ];

         if (this.withCumulativeLine) {
            const cumulativeLineData = [];
            barData.forEach((v, i) => {
               cumulativeLineData.push(i ? {x: v.x, y: v.y + cumulativeLineData[i - 1].y} : v);
            });

            this.realityBoundsPoints.forEach((p, ind) => {
               let insertIndex;
               cumulativeLineData.some((d, i) => {
                  if (d.x > p.x) {
                     insertIndex = i;
                     return true;
                  }
               });

               const j = insertIndex;
               const xa = cumulativeLineData[j - 1].x;
               const xb = cumulativeLineData[j].x;
               const xc = p.x;
               const ya = cumulativeLineData[j - 1].y;
               const yb = cumulativeLineData[j].y;

               p.y = (yb * (xc - xa) + ya * (xb - xc)) / (xb - xa);
               p.dataLabels = {
                  enabled: true,
                  formatter() {
                     return (this.y).toFixed(3);
                  },
                  x: (ind === 0) ? -14 : 17,
                  y: (ind === 0) ? 0 : 19
               };
            });

            this.chartOptions.yAxis = [
               {},
               {
                  id: 'cumulative',
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

            this.chartOptions.series.push({
               type: 'scatter',
               data: this.realityBoundsPoints,
               marker: {
                  enabled: true,
                  radius: 5,
                  fillColor: this.specialColor,
                  symbol: 'circle'
               },
               yAxis: 'cumulative',
               zIndex: 200
            });
         }

         this.showChart = true;
      }
   }

   convertData(data: number[]): {x: number, y: number}[] {
      let convertedData: {x: number, y: number}[] = [];
      let dataFiltered = data.filter(v => !isNaN(v));

      if (this.cutPercent) {
         dataFiltered = dataFiltered.filter(v => v < 12 && v > -12);
      }

      this.realityBounds.forEach(bound => {
         this.realityBoundsPoints.push({
            x: bound
         });
      });

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

      convertedData = convertedData.map(d => ({
         x: d.x - binStep / 2,
         y: d.y
      }));

      return convertedData;
   }

}
