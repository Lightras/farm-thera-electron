import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {MockService} from '../services/mock.service';
import {ColAddMode, Column} from '../app.interfaces';
import {Router} from '@angular/router';

@Component({
   selector: 'app-data-view-markup',
   templateUrl: './data-view-markup.component.html',
   styleUrls: ['./data-view-markup.component.sass']
})
export class DataViewMarkupComponent implements OnInit {
   titles: string[];
   fileData: any;
   selectedCol: Column;
   addingMode: ColAddMode;
   currentColNumber: number;
   selectedColsNumbers: number[] = [];
   workData: Column[] = [];


   constructor(
      private dataService: DataService,
      private mockService: MockService,
      private router: Router
   ) {
      //
      mockService.getMockData('Nehospit_pnevmonii_RAW').subscribe(r => {
         dataService.rawData = r;
         dataService.titles = dataService.rawData.shift();


         this.fileData = dataService.rawData;
         this.titles = dataService.titles;
      });
      //


   }

   ngOnInit() {
   }

   selectColumn(i: number) {
      this.currentColNumber = i;

      this.selectedCol = {
         data: this.fileData.map(x => x[i]),
         meta: {
            title: this.titles[i],
            type: this.addingMode,
            initialColIndex: i
         }
      };
   }

   onAddingModeChange(addingMode) {
      this.addingMode = addingMode;
   }

   onAddColChange(cols: Column[]) {
      if (cols.length) {
         if (cols.length === 1) {
            this.workData.push(cols[0]);
            this.selectedColsNumbers.push(cols[0].meta.initialColIndex);
         } else {
            cols.forEach((col, i) => {
               if (i === 0) {
                  col.meta.mainCol = true;
               }
               this.workData.push(col);
               this.selectedColsNumbers.push(col.meta.initialColIndex);
            });
         }
      }
   }

   finishMarkup() {
      this.dataService.workData = this.workData;

      this.router.navigate(['calc-and-analysis']);
   }

}
