import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartTitles} from '../../app.interfaces';
import {Chart, SeriesBarOptions} from 'highcharts';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import * as Z from 'zebras';
import {DataServiceOld} from '../../data-service-old.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.sass']
})
export class LineChartComponent implements OnInit, OnChanges {

   @Input() lineData: number[][];
   @Input() titles: ChartTitles;
   @Input() cumulative = false;
   @Input() skipZeros = false;
   @Input() normalize: boolean;

   Highcharts: typeof Highcharts;
   lineChartOptions: Highcharts.Options;
   chart: Chart;
   updateFlag: boolean;
   showChart: boolean;

   constructor(
      private chartService: ChartsService,
      private cdr: ChangeDetectorRef,
      private dataService: DataServiceOld
   ) {
      this.Highcharts = chartService.Highcharts;
      this.lineChartOptions = {
         chart: {
            type: 'spline',
            width: 600,
            height: 400
         },

         legend: {
            useHTML: true,
            width: 600,
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
      if (changes.lineData && changes.lineData.currentValue) {
         this.lineChartOptions.series = [] as SeriesBarOptions[];

         // const titles = [
         //    'Ротавірус - &nbsp;&nbsp; Цинка сульфат -',
         //    'Ротавірус + &nbsp;&nbsp; Цинка сульфат -',
         //    'Ротавірус - &nbsp;&nbsp; Цинка сульфат +',
         //    'Ротавірус + &nbsp;&nbsp; Цинка сульфат +',
         // ];

         const titles = [
            'без цинка сульфату',
            'з цинка сульфатом'
         ];

         //
         // const titles = [
         //    'дні нормалізації показників',
         //    'дні госпіталізації'
         // ];

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

            this.lineChartOptions.series.push({
               name: titles[i],
               data: lineSeriesData, zIndex: !i ? 2 : 0} as SeriesBarOptions);
            this.showChart = true;
         });
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
