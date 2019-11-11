import {Component, EventEmitter, OnInit} from '@angular/core';
import {DataServiceOld} from './data-service-old.service';
import {TranslateService} from '@ngx-translate/core';
import {Column} from './app.interfaces';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
   fileData: string[][];
   workData: Column[];
   calcResults: any;

   categories1 = [
      'Не виявлено',
      'Аденовірус + Метапневмовірус',
      'Аденовірус + Парагрип',
      'Риновірус',
      'Аденовірус+ Грип А',
      'Аденовірус + РС-вірус',
      'Аденовірус',
      'Коронавірус',
      'Аденовірус + Риновірус',
      'Парагрип'
   ];

   series1 = [12, 4, 2, 2, 1, 1, 18, 4, 2, 2];

   categories2 = [
      'Не виявлено',
      'St. aureus',
      'Str. viridans',
      'Str. pneumoniae',
      'St. Saprophiticus',
      'St. pyogenes',
      'Candida alb.'
   ];

   series2 = [1, 14, 24, 36, 29, 8, 2];

   stackedDataTempPrep = [
      {
         name: '<37 °C',
         data: [0, 40, 46]
      },
      {
         name: '37-38 °C',
         data: [29, 6, 2]
      },
      {
         name: '>38 °C',
         data: [19, 2, 0]
      }
   ];

   stackedDataTempNoPrep = [
      {
         name: '<37 °C',
         data: [1, 41, 59]
      },
      {
         name: '37-38 °C',
         data: [9, 16, 3]
      },
      {
         name: '>38 °C',
         data: [56, 9, 4]
      }
   ];

   stackedDataESRPrep = [
      {
         name: '2-18 мм/год',
         data: [33, 35, 46]
      },
      {
         name: '18-34 мм/год',
         data: [9, 11, 2]
      },
      {
         name: '34-50 мм/год',
         data: [6, 2, 0]
      }
   ];

   stackedDataESRNoPrep = [
      {
         name: '2-18 мм/год',
         data: [34, 26, 63]
      },
      {
         name: '18-34 мм/год',
         data: [26, 35, 1]
      },
      {
         name: '34-50 мм/год',
         data: [6, 5, 2]
      }
   ];

   stackedDataLcPrep = [
      {
         name: '3.1-10.7 * 10^9/мл',
         data: [45, 47, 48]
      },
      {
         name: '10.7-18.3 * 10^9/мл',
         data: [3, 1, 0]
      },
      {
         name: '18.3-25.9 * 10^9/мл',
         data: [0, 0, 0]
      }
   ];

   stackedDataLcNoPrep = [
      {
         name: '3.1-10.7 * 10^9/мл',
         data: [48, 59, 66]
      },
      {
         name: '10.7-18.3 * 10^9/мл',
         data: [15, 7, 0]
      },
      {
         name: '18.3-25.9 * 10^9/мл',
         data: [3, 0 , 0]
      }
   ];

   stackedDataSputumPrep = [
      {
         name: 'немає',
         data: [0, 0, 46]
      },
      {
         name: 'слизова',
         data: [43, 48, 2]
      },
      {
         name: 'слизово-гнійна',
         data: [5, 0, 0]
      }
   ];

   stackedDataSputumNoPrep = [
      {
         name: 'немає',
         data: [0, 1, 37]
      },
      {
         name: 'слизова',
         data: [21, 60, 29]
      },
      {
         name: 'слизово-гнійна',
         data: [45, 5, 0]
      }
   ];

   constructor(
      private dataService: DataServiceOld,
      private translate: TranslateService
   ) {
      translate.setDefaultLang('ua');
      translate.use('ua');
   }

   ngOnInit(): void {
      // this.dataService.getMockData().subscribe(data => {
      //    this.workData = data;
      // });
   }

   onFileChange(data) {
      console.log('data: ', JSON.stringify(data));
      this.fileData = data;
   }
}
