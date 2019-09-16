import {AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ColAddMode, Column} from '../app.interfaces';
import {ColumnAdderComponent} from './column-adder/column-adder.component';

@Component({
   selector: 'app-data-viewer',
   templateUrl: './data-viewer.component.html',
   styleUrls: ['./data-viewer.component.sass']
})
export class DataViewerComponent implements OnInit, OnChanges, AfterViewInit {

   @Input() fileData: string[][];
   @ViewChild(ColumnAdderComponent, {static: false}) columnAdder: ColumnAdderComponent;

   selectedCol: Column;
   addedColumns: Column[];
   titles: string[];
   addingMode: ColAddMode;

   constructor() { }

   ngOnInit() {
   }

   ngAfterViewInit(): void {
      this.columnAdder.addColChange.subscribe(c => {
         this.addedColumns = c;
      });
   }

   ngOnChanges(changes: SimpleChanges): void {
      const fileData = changes.fileData.currentValue;
      if (fileData) {
         this.titles = fileData.shift();
      }
   }

   selectColumn(i: number) {
      this.selectedCol = {
         data: this.fileData.map(x => x[i]),
         meta: {
            title: this.titles[i],
            type: this.addingMode
         }
      };
   }

   onAddingModeChange(addingMode) {
      this.addingMode = addingMode;
   }
}
