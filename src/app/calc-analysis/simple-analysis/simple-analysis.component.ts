import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import {DataService} from '../../services/data.service';


@Component({
   selector: 'app-simple-analysis',
   templateUrl: './simple-analysis.component.html',
   styleUrls: ['./simple-analysis.component.sass']
})
export class SimpleAnalysisComponent implements OnInit, OnChanges {
   @Input() data: Column[];
   @Input() withNorm: boolean;

   da: number[];
   db: number[];
   daData: Column[];
   dbData: Column[];

   constructor(
      private dataService: DataService
   ) { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.data) {

         this.dataService.getSubSetsTherapy(this.data);
      }
   }

}
