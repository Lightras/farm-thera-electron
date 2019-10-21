import { Injectable } from '@angular/core';
import * as Z from 'zebras';
import * as random from 'random';
import * as superRandom from 'random-js';
import {Column} from './app.interfaces';
import {DataService} from './data.service';
import * as deepcopy from 'deepcopy';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(
     private dataService: DataService
  ) { }

   randomizeFromDistribution(distr: number[], N: number, isCumulative?: boolean): number[] {
      const rand = [];
      const cumulativeDistr = isCumulative ? distr : Z.cumulative(Z.sum, distr);
      const max = Z.max(cumulativeDistr);

      for (let j = 0; j < N; j++) {
         const rnd = random.float(0, max);

         cumulativeDistr.some((prob, i) => {
            if (rnd <= prob) {
               rand.push(i);
               return true;
            }
         });
      }

      return rand;
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

   calculation2(da, db) {
      return da.map((x, i) => da[i] - db[i]);
   }
}
