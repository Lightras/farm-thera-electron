import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import * as deepcopy from 'deepcopy';
import {DataService} from '../../services/data.service';


@Component({
   selector: 'app-simple-analysis',
   templateUrl: './simple-analysis.component.html',
   styleUrls: ['./simple-analysis.component.sass']
})
export class SimpleAnalysisComponent implements OnInit, OnChanges {
   @Input() data: Column[];

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
         this.getSubSetsTherapy(this.data)
      }
   }

   getSubSetsTherapy(workData: Column[], normDays: number[]) {
      const da = [];
      const db = [];

      const therapyCol = this.dataService.getCol(workData, 'therapy');

      const daIndex = [];
      const dbIndex = [];

      normDays.forEach((d, i) => {
         if (therapyCol.data[i]) {
            db.push(d);
            dbIndex.push(i);
         } else {
            da.push(d);
            daIndex.push(i);
         }
      });

      const daData = workData.map(col => {
         const newCol = deepcopy(col);
         newCol.data = col.data.filter((x, i) => daIndex.includes(i));
         return newCol;
      });

      const dbData = workData.map(col => {
         const newCol = deepcopy(col);
         newCol.data = col.data.filter((x, i) => dbIndex.includes(i));
         return newCol;
      });

      return [daData, dbData, da, db];
   }

}
