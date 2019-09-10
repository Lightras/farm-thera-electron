import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DataObj} from '../app.interfaces';
import * as z from 'zebras';

@Component({
   selector: 'app-data-viewer',
   templateUrl: './data-viewer.component.html',
   styleUrls: ['./data-viewer.component.sass']
})
export class DataViewerComponent implements OnInit, OnChanges {
   titles: string[];

   @Input() dataObj: DataObj;

   constructor() { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      const dataObj = changes.dataObj.currentValue;
      if (dataObj) {
         console.log('dataObj: ', dataObj);
         this.titles = dataObj[0];
      }
   }
}
