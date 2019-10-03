import {Component, EventEmitter, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {TranslateService} from '@ngx-translate/core';
import {Column} from './app.interfaces';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
   fileData: string[][];
   dataObj: any;
   parsingResult: EventEmitter<any> = new EventEmitter();
   workData: Column[];
   calcResults: any;

   constructor(
      private dataService: DataService,
      private translate: TranslateService
   ) {
      translate.setDefaultLang('ua');
      translate.use('ua');
   }

   ngOnInit(): void {
      this.dataService.getMockData().subscribe(data => {
         this.workData = data;
      });
   }

   onFileChange(data) {
      this.fileData = data;
   }
}
