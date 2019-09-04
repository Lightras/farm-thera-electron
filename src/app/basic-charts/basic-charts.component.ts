import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartTitles, DataObj, PieData} from '../app.interfaces';
import * as z from 'zebras';
import {DataService} from '../data.service';

@Component({
   selector: 'app-basic-charts',
   templateUrl: './basic-charts.component.html',
   styleUrls: ['./basic-charts.component.sass']
})
export class BasicChartsComponent implements OnInit, OnChanges {
   rviData: PieData;
   therapyData: PieData;

   @Input() dataObj: DataObj;
   daysDistribution: number[];

   daysChartTitles: ChartTitles;

   constructor(
      private dataService: DataService,
) {
      this.daysChartTitles = {
         chartTitle: 'Розподіл днів одужання',
         xAxisTitle: 'Дні',
         yAxisTitle: 'Частка'
      };
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.dataObj.currentValue) {
         const dataObj = changes.dataObj.currentValue;

         this.rviData = this.getPieData(dataObj, 'virus');
         this.therapyData = this.getPieData(dataObj, 'therapy');

         this.daysDistribution = this.dataService.buildDistribution(z.getCol('days', dataObj.data));
      }
   }

   private getPieData(dataObj: DataObj, field: string): PieData {
      const dataGrouped = z.groupBy(x => x[field], dataObj.data);
      const pieData = [];
      for (let key in dataGrouped) {
         if (dataGrouped.hasOwnProperty(key)) {
            pieData.push([key, dataGrouped[key].length]);
         }
      }

      return pieData;
   }

}
