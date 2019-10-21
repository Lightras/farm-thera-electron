import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartTitles} from '../../app.interfaces';
import {Chart, SeriesBarOptions} from 'highcharts';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import * as Z from 'zebras';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.sass']
})
export class LineChartComponent implements OnInit, OnChanges {

   @Input() lineData: number[][];
   @Input() titles: ChartTitles;
   @Input() cumulative = false;

   Highcharts: typeof Highcharts;
   lineChartOptions: Highcharts.Options;
   chart: Chart;
   updateFlag: boolean;
   showChart: boolean;

   constructor(
      private chartService: ChartsService,
      private cdr: ChangeDetectorRef
   ) {
      this.Highcharts = chartService.Highcharts;
      this.lineChartOptions = {
         chart: {
            type: 'line'
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
      if (changes.lineData && changes.lineData.currentValue) {
         this.lineChartOptions.series = [] as SeriesBarOptions[];

         this.lineData.forEach(data => {
            const lineData = this.cumulative ? Z.cumulative(Z.sum, data) : data;

            const lineSeriesData = lineData.map((v, i) => ({x: i, y: v}));

            this.lineChartOptions.series.push({data: lineSeriesData} as SeriesBarOptions);
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
