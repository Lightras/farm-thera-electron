import {Component, EventEmitter, OnInit, Output} from '@angular/core';

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
      this.fileChange.emit(file);
   }
}
