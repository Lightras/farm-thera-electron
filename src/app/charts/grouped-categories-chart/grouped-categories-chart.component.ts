import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Chart, SeriesBarOptions} from 'highcharts';
import {ChartsService} from '../charts.service';


@Component({
   selector: 'app-grouped-categories-chart',
   templateUrl: './grouped-categories-chart.component.html',
   styleUrls: ['./grouped-categories-chart.component.sass']
})
export class GroupedCategoriesChartComponent implements OnInit, OnChanges {
   @Input() categories;
   @Input() data;

   chart: Chart;
   Highcharts: typeof Highcharts;
   barChartOptions: Highcharts.Options;
   updateFlag: boolean;
   showChart: boolean;

   constructor(
      private chartService: ChartsService,
   ) {
      this.Highcharts = chartService.Highcharts;
      this.barChartOptions = {
         chart: {
            type: 'column'
         },

         legend: {
            enabled: false
         }
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.categories) {
         this.barChartOptions.xAxis = {
            categories: this.categories
         };
      }

      if (changes.data) {
         this.barChartOptions.series = [{
            data: this.data
         }] as SeriesBarOptions[];
      }

      if (this.barChartOptions.xAxis && this.barChartOptions.series) {
         this.showChart = true;
      }
   }

}
