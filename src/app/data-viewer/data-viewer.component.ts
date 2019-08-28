import {Component, Input, OnInit} from '@angular/core';
import {DataObj} from '../app.interfaces';

@Component({
   selector: 'app-data-viewer',
   templateUrl: './data-viewer.component.html',
   styleUrls: ['./data-viewer.component.sass']
})
export class DataViewerComponent implements OnInit {

   @Input('dataObj') dataObj: DataObj;

   constructor() { }

   ngOnInit() {

   }

}
