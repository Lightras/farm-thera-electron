import {Component, EventEmitter, OnInit} from '@angular/core';
import * as papa from 'papaparse';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   dataObj: any;
   parsingResult: EventEmitter<any> = new EventEmitter();

   ngOnInit(): void {
      this.parsingResult.subscribe(result => {
         this.dataObj = result;
      });
   }

   onFileChange(file) {
      const data = papa.parse(file, {
         complete: (result) => {
            this.parsingResult.emit(result);
         },
         header: true
      });
   }
}
