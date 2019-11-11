import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';

@Component({
   selector: 'app-data-view-markup',
   templateUrl: './data-view-markup.component.html',
   styleUrls: ['./data-view-markup.component.sass']
})
export class DataViewMarkupComponent implements OnInit {
   titles: string[];
   fileData: any;

   constructor(
      private dataService: DataService
   ) {
      this.fileData = dataService.rawData;
      this.titles = dataService.titles;
   }

   ngOnInit() {
   }

   selectColumn(i: number) {

   }
}
