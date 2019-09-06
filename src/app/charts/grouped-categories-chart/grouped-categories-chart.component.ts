import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighchartsGroupedCategories from 'highcharts-grouped-categories';
import {Chart, SeriesBarOptions} from 'highcharts';
import {ChartsService} from '../charts.service';

HighchartsGroupedCategories(Highcharts);

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
            width: 950,
            height: 500,
            type: 'column',
            style: {
               fontFamily: 'Arial',
               color: 'black'
            }
         },

         title: {
            text: ''
         },

         yAxis: {
            title: {
               text: ''
            }
         },

         plotOptions: {
            column: {
               dataLabels: {
                  enabled: true
               }
            }
         },

         legend: {
            enabled: false
         }
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      console.log('changes: ', changes);
      if (changes.categories.currentValue) {
         console.log('changes.categories: ', changes.categories);
         (this.barChartOptions.xAxis as any) = {
            categories: this.categories,
            labels: {
               groupedOptions: [
                  {
                     rotation: 0,
                     style: {
                        color: 'black',
                        fontSize: '11px'
                     }
                  }
               ],
               rotation: -90,
               align: 'right',
               y: 3,
               padding: 20,
               style: {
                  color: 'black',
                  fontSize: '14px',
                  fontFamily: 'Arial'
               }
            },
         };
      }

      if (changes.data.currentValue) {
         this.barChartOptions.series = [{
            data: this.data
         }
         ] as SeriesBarOptions[];
      }

      if (this.barChartOptions.xAxis && this.barChartOptions.series) {
         this.showChart = true;
      }
   }

}
