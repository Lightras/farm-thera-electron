import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {SeriesBarOptions} from 'highcharts';
import {ChartsService} from '../charts.service';
import * as Z from 'zebras';
import {DataService} from '../../services/data.service';
import {ChartForemotherComponent} from '../chart-foremother/chart-foremother.component';

@Component({
  selector: 'app-line-chart',
  templateUrl: '../chart-foremother/chart-foremother.component.html',
  styleUrls: ['./line-chart.component.sass']
})
export class LineChartComponent extends ChartForemotherComponent implements OnInit, OnChanges {

   @Input() lineData: number[][];
   @Input() dataNames: string[];
   @Input() cumulative = false;
   @Input() skipZeros = false;
   @Input() normalize: boolean;

   @Input() width: number;
   @Input() height: number;

   chartOptions: Highcharts.Options;

   constructor(
      chartService: ChartsService,
      cdr: ChangeDetectorRef,
      private dataService: DataService
   ) {
      super(chartService, cdr);

      this.chartOptions = {
         chart: {
            type: 'spline',
         },

         legend: {
            useHTML: true,
            align: 'center'
         },

         tooltip: {
            valueDecimals: 3
         }
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      this.showChart = false;
      super.ngOnChanges(changes);

      if (this.width && this.height) {
         this.chartOptions.chart.width = this.width;
         this.chartOptions.chart.height = this.height;
         this.updateFlag = true;
      }

      if (changes.lineData && changes.lineData.currentValue) {
         this.chartOptions.series = [] as SeriesBarOptions[];

         this.lineData.forEach((data, i) => {
            const lineData = this.cumulative ? Z.cumulative(Z.sum, data) : data;

            let lineSeriesData = [];

            if (this.skipZeros) {
               lineData.forEach((v, j) => {
                  if (v) {
                     lineSeriesData.push({x: j, y: v});
                  }
               });
            } else {
               lineSeriesData = lineData.map((v, j) => ({x: j, y: v}));
            }

            if (this.normalize) {
               const total = this.lineData.reduce((accum, p) => accum + p.reduce((subAccum, subP) => subAccum + subP, 0), 0) / 2;
               lineSeriesData = this.dataService.normalizeXY(lineSeriesData, total);
            }

            this.chartOptions.series.push({
               data: lineSeriesData, zIndex: !i ? 2 : 0,
               name: this.dataNames ? this.dataNames[i] : null
            } as SeriesBarOptions);
            });
      }

      this.showChart = true;
   }

}
