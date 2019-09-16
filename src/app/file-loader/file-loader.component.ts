import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as papa from 'papaparse';


@Component({
   selector: 'app-file-loader',
   templateUrl: './file-loader.component.html',
   styleUrls: ['./file-loader.component.sass']
})
export class FileLoaderComponent implements OnInit {
   @Output() fileChange: EventEmitter<any> = new EventEmitter();

   constructor() { }

   file: any;

   ngOnInit() {
   }

   inputFile(e: Event) {
      const file = (e.target as HTMLInputElement).files[0];

      papa.parse(file, {
         complete: (result) => {
            const lastRow = result.data[result.data.length - 1];
            if (lastRow && lastRow.length === 1) {
               result.data.pop();
            }
            this.fileChange.emit(result.data);
         },
         header: false,
         encoding: 'cp1251'
      });
   }
}
