import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BasicChartData} from '../../app.interfaces';
import {ChartsService} from '../charts.service';
import {SeriesBarOptions, SeriesLineOptions} from 'highcharts';
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

   constructor(
      chartService: ChartsService,
      cdr: ChangeDetectorRef
   ) {
      super(chartService, cdr);

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
      super.ngOnInit();

   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.data) {
         console.log('this.data: ', this.data);
         let barData;

         if (!(this.data as BasicChartData)[0].x) {
            this.data = (this.data as []).map((v, i) => ({x: i, y: v}));
         }
         barData = this.cumulative ? Z.cumulative(Z.sum, this.data) : this.data;

         const cumulativeLineData = [];

         if (this.normalized) {
            const sum = (this.data as BasicChartData).reduce((accum, v) => accum + v.y, 0);
            barData = barData.map(v => ({x: v.x, y: v.y / sum}));
         }

         console.log('this.barChartOptions: ', this.barChartOptions);

         this.barChartOptions.series = [{
            data: barData
         }] as SeriesBarOptions[];

         if (this.withCumulativeLine) {
            barData.forEach((v, i) => {
               cumulativeLineData.push(i ? {x: v.x, y: v.y + cumulativeLineData[i - 1].y} : v);
            });

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

      this.updateFlag = true;
   }

}
