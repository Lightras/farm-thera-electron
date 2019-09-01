import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

const globalChartOptions: Highcharts.Options = {
   credits: {
      enabled: false
   },

   title: {
      style: {
         fontSize: '14px',
      }
   }
};

Highcharts.setOptions(globalChartOptions);

@Injectable({
   providedIn: 'root'
})
export class ChartsService {
   Highcharts: typeof Highcharts = Highcharts;

   constructor() {
   }
}
