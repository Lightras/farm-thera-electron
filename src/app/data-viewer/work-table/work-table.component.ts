import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import {DataServiceOld} from '../../data-service-old.service';

@Component({
   selector: 'app-work-table',
   templateUrl: './work-table.component.html',
   styleUrls: ['./work-table.component.sass']
})
export class WorkTableComponent implements OnInit, OnChanges {
   @Input() addedColumns: Column[];
   @Input() showWorkTable: boolean;
   @Input() showNormDays: boolean;
   @Input() normDays: number[];

   @Input() testType: string;

   @Output() workData = new EventEmitter<Column[]>();
   @Output() gotTestData = new EventEmitter<Column[]>();

   workTableData: Column[] = [];
   withIndicator: boolean;

   constructor(
      private dataService: DataServiceOld
   ) { }

   ngOnInit() {
      // this.dataService.getMockData().subscribe(data => {
      //    this.workTableData = data;
      //    this.workData.emit(this.workTableData);
      //    this.withIndicator = true;
      //    this.showWorkTable = true;
      // });
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.addedColumns && changes.addedColumns.currentValue) {
         if (this.addedColumns.length === 3) {
            this.addedColumns[0].meta.mainCol = true;
         }

         this.workTableData = this.workTableData.concat(this.addedColumns);

         if (this.workTableData.some(d => d.meta.type === 'indicator')) {
            this.withIndicator = true;
         }
      }

      if (changes.showWorkTable && changes.showWorkTable.currentValue) {
         console.log(JSON.stringify(this.workTableData));
         this.workData.emit(this.workTableData);
      }

      if (changes.testType && changes.testType.currentValue) {
         this.dataService.getMockFileData(this.testType).subscribe(data => {
            this.workTableData = data;
            this.workData.emit(this.workTableData);

            if (this.testType === 'Nehospit_pnevmonii') {
               this.withIndicator = true;
            }

            this.gotTestData.emit(this.workTableData);

            this.showWorkTable = true;
         });
      }
   }
}
