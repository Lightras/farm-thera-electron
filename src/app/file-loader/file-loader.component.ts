import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as papa from 'papaparse';
import {Router} from '@angular/router';
import {DataService} from '../services/data.service';
import {MockService} from '../services/mock.service';


@Component({
   selector: 'app-file-loader',
   templateUrl: './file-loader.component.html',
   styleUrls: ['./file-loader.component.sass']
})
export class FileLoaderComponent implements OnInit {
   @Output() fileChange: EventEmitter<any> = new EventEmitter();

   @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

   constructor(
      private router: Router,
      private dataService: DataService,
   ) {
   }

   file = {
      name: null,
      data: null
   };

   titles: string[];

   ngOnInit() {
   }

   changeFile(e: Event) {
      const file = (e.target as HTMLInputElement).files[0];
      this.file.name = file.name;

      papa.parse(file, {
         complete: (result) => {
            const lastRow = result.data[result.data.length - 1];
            if (lastRow && lastRow.length === 1) {
               result.data.pop();
            }

            this.titles = result.data.shift();
            this.file.data = result.data;

            this.fileChange.emit(result.data);
         },
         header: false,
         encoding: 'cp1251'
      });
   }

   loadFile() {
      this.fileInput.nativeElement.click();
   }

   goToMarkup() {
      this.dataService.rawData = this.file.data;
      this.dataService.titles = this.titles;

      this.router.navigate(['view-and-markup']);
   }
}
