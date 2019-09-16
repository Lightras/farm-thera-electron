import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';

@Component({
   selector: 'app-work-table',
   templateUrl: './work-table.component.html',
   styleUrls: ['./work-table.component.sass']
})
export class WorkTableComponent implements OnInit, OnChanges {
   @Input() addedColumns: Column[];

   workTableData: Column[] = [];
   showTable: boolean;
   withIndicator: boolean;

   constructor() { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.addedColumns && changes.addedColumns.currentValue) {
         if (this.addedColumns.length === 3) {
            this.addedColumns[0].meta.mainCol = true;
         }

         this.workTableData = this.workTableData.concat(this.addedColumns);

         if (this.workTableData.length === 6) {

            console.log('this.workTableData: ', this.workTableData);

            this.withIndicator = true;
            this.showTable = true;
         }
      }
   }
}
