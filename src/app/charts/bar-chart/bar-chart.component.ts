import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BasicChartData} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import {PlotLineLabelOptions, SeriesBarOptions, SeriesLineOptions} from 'highcharts';
import * as Z from 'zebras';
import {ChartForemotherComponent} from '../chart-foremother/chart-foremother.component';

@Component({
   selector: 'app-bar-chart',
   templateUrl: '../chart-foremother/chart-foremother.component.html',
   styleUrls: ['./bar-chart.component.sass']
})
export class BarChartComponent extends ChartForemotherComponent implements OnInit, OnChanges {
   @Input() cumulative = false;
   @Input() normalized = false;
   @Input() withCumulativeLine = true;
   @Input() realityBounds: number[] = [];

   realityBoundsPoints: any[] = [];
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
      super.ngOnInit();

   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.data) {
         let barData;

         console.log('this.data: ', this.data);

         if (!(this.data as BasicChartData)[0].x) {
            this.data = (this.data as []).map((v, i) => ({x: i, y: v}));
         }
         barData = this.cumulative ? Z.cumulative(Z.sum, this.data) : this.data;

         const cumulativeLineData = [];

         if (this.normalized) {
            const sum = (this.data as BasicChartData).reduce((accum, v) => accum + v.y, 0);
            barData = barData.map(v => ({x: v.x, y: v.y / sum}));
         }

         this.chartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

         if (this.withCumulativeLine) {
            barData.forEach((v, i) => {
               cumulativeLineData.push(i ? {x: v.x, y: v.y + cumulativeLineData[i - 1].y} : v);
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
         }

         const mean = barData.reduce((expected, v) => expected + v.x * v.y, 0);

         this.chartOptions.xAxis = [
            {
               plotLines: [
                  {
                     value: mean,
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

         this.realityBounds.forEach(bound => {
            this.realityBoundsPoints.push({
               x: bound
            });
         });

         this.realityBoundsPoints.forEach((p, ind) => {
            let insertIndex;
            cumulativeLineData.some((d, i) => {
               if (d.x > p.x) {
                  insertIndex = i;
                  return true;
               }
            });

            console.log('insertIndex: ', insertIndex);

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

         console.log('this.realityBoundsPoints: ', this.realityBoundsPoints);

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

         this.showChart = true;
      }

      this.updateFlag = true;
   }

}
