import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ChartsService} from '../charts.service';
import {ChartForemotherComponent} from '../chart-foremother/chart-foremother.component';
import {DataOptions, SeriesLineOptions, SeriesOptions, SeriesScatterOptions} from 'highcharts';
import * as Z from 'zebras';
import {BasicChartData} from '../../app.interfaces';
import {CalcService} from '../../services/calc.service';

@Component({
   selector: 'app-scatter',
   templateUrl: '../chart-foremother/chart-foremother.component.html',
   styleUrls: ['./scatter.component.sass']
})
export class ScatterComponent extends ChartForemotherComponent implements OnInit, OnChanges {

   @Input() withMean: boolean;

   chartOptions: Highcharts.Options;

   constructor(
      chartService: ChartsService,
      cdr: ChangeDetectorRef,
      private calcService: CalcService
   ) {
      super(chartService, cdr);

      this.chartOptions = {
         chart: {
            type: 'scatter'
         },

         legend: {
            enabled: false
         },

         tooltip: {
            valueDecimals: 3
         },

         series: [
            {
               turboThreshold: 0,
               data: [],
               marker: {
                  radius: 1
               }
            } as SeriesScatterOptions,
            {
               type: 'line',
               color: 'red',
               data: [],
            }
         ]
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {

      if (this.data && this.withMean) {
         const meanLineData = this.getMeanLineData(this.data as BasicChartData);
         const regressionLineData = this.calcService.findLineByLeastSquares(meanLineData.map(v => v.x), meanLineData.map(v => v.y));

         (this.chartOptions.series[1] as SeriesLineOptions).data = regressionLineData;
      }

      if (this.data) {
         (this.chartOptions.series[0] as SeriesScatterOptions).data = this.data;
         this.showChart = true;
         this.updateFlag = true;
      }

      super.ngOnChanges(changes);

   }

   getMeanLineData(data: {x: number, y: number}[]) {
      const layers: {x: number, y: number[]}[] = [];

      data.forEach(point => {
         if (!layers.some(lp => lp.x === point.x)) {
            layers.push({x: point.x, y: []});
         }

         const layer = layers.find(l => l.x === point.x);
         layer.y.push(point.y);
      });

      return layers.map(l => ({
         x: l.x,
         y: Z.mean(l.y)
      }));
   }
}
