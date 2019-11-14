import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Chart} from 'highcharts';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {BasicChartData, ChartTitles} from '../../app.interfaces';

@Component({
   selector: 'app-chart-foremother',
   templateUrl: './chart-foremother.component.html',
   styleUrls: ['./chart-foremother.component.sass']
})
export class ChartForemotherComponent implements OnInit, OnChanges {
   @Input() titles: ChartTitles;
   @Input() data: number[] | BasicChartData;

   Highcharts: typeof Highcharts;
   chartOptions: Highcharts.Options;
   chart: Chart;
   updateFlag: boolean;
   showChart: boolean;

   constructor(
      private chartService: ChartsService,
      private cdr: ChangeDetectorRef
   ) {
      this.Highcharts = chartService.Highcharts;
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      this.updateFlag = true;
   }

   onChartInstance(chart) {
      this.chart = chart;
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
