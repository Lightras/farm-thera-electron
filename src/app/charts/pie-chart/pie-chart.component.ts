import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartsService} from '../charts.service';
import * as Highcharts from 'highcharts';
import {Chart, SeriesPieDataOptions, SeriesPieOptions} from 'highcharts';

@Component({
   selector: 'app-pie-chart',
   templateUrl: './pie-chart.component.html',
   styleUrls: ['./pie-chart.component.sass']
})
export class PieChartComponent implements OnInit, OnChanges {
   Highcharts: typeof Highcharts;
   pieChartOptions: Highcharts.Options;
   showChart: boolean;
   updateFlag: boolean;

   @Input() pieData: [string, number][];
   @Input() chartTitle: string;
   chart: Chart;

   constructor(
      private chartsService: ChartsService,
      private cdr: ChangeDetectorRef
   ) {
      this.Highcharts = chartsService.Highcharts;
      this.pieChartOptions = {
         chart: {
            type: 'pie',
            width: 250,
            height: 230
         },

         title: {
            text: ''
         },

         plotOptions: {
            pie: {
               size: 150,
               dataLabels: {
                  format: '{point.y}',
                  distance: -30,
                  style: {
                     fontSize: '20px',
                     color: 'white'
                  }
               },
               showInLegend: true
            }
         },

         series: [{
            data: null
         } as SeriesPieOptions]
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.pieData && changes.pieData.currentValue) {
         console.log('pieData: ', changes.pieData);

         (this.pieChartOptions.series as SeriesPieOptions[])[0].data = this.pieData as SeriesPieDataOptions[];
         this.showChart = true;
         this.cdr.detectChanges();
         this.chart.reflow();
         this.updateFlag = true;
      }

      if (changes.chartTitle && changes.chartTitle.currentValue) {
         this.cdr.detectChanges();
         this.chart.setTitle({text: changes.chartTitle.currentValue});
      }
   }

}
