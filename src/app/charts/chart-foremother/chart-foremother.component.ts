import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Chart} from 'highcharts';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {ChartTitles} from '../../app.interfaces';

@Component({
   selector: 'app-chart-foremother',
   templateUrl: './chart-foremother.component.html',
   styleUrls: ['./chart-foremother.component.sass']
})
export class ChartForemotherComponent implements OnInit, OnChanges {
   @Input() titles: ChartTitles;
   @Input() data: number[];

   Highcharts: typeof Highcharts;
   barChartOptions: Highcharts.Options;
   chart: Chart;
   updateFlag: boolean;
   showChart: boolean;

   constructor(
      private chartService: ChartsService,
      private cdr: ChangeDetectorRef
   ) {
      console.log('super constructon');
      this.Highcharts = chartService.Highcharts;
   }

   ngOnInit() {
      console.log('super onInit');
   }

   ngOnChanges(changes: SimpleChanges): void {
      console.log('super onChanges');

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
