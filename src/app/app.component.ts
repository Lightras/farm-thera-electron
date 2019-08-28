import {Component, EventEmitter, OnInit} from '@angular/core';
import * as papa from 'papaparse';
import {DataService} from './data.service';
import * as z from 'zebras';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
   dataObj: any;
   parsingResult: EventEmitter<any> = new EventEmitter();

   constructor(
      private dataService: DataService
   ) {}

   ngOnInit(): void {
      this.dataService.getMockData().subscribe(data => {
         this.dataObj = data;

         const a = z.getCol('virus', this.dataObj.data);
         console.log('a: ', a);
      });

      this.parsingResult.subscribe(result => {
         this.dataObj = result;
      });
   }

   onFileChange(file) {
      papa.parse(file, {
         complete: (result) => {
            this.parsingResult.emit(result);
         },
         header: true
      });
   }
}
