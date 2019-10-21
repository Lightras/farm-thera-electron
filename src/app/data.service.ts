import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as Z from 'zebras';
import {ColAddMode, Column} from './app.interfaces';
import * as random from 'random';

@Injectable({
   providedIn: 'root'
})
export class DataService {

   constructor(
      private http: HttpClient
   ) { }

   sampleSize = 1000;

   getMockData(): Observable<any> {
      return this.http.get('assets/mock-normalization-data.json');
   }

   buildDistribution(data: number[], isNormalized?: boolean, includeNegative?: boolean): number[] {
      console.log('data: ', data);
      const max = Math.max(...data);
      const start = includeNegative ? Math.min(...data) : 0;
      const valueCounts = Z.valueCounts(data);
      const distribution = [];

      for (let i = start; i <= max; i++) {
         distribution[i] = valueCounts[i] ? valueCounts[i] : 0;
      }

      const distributionNormalized = distribution.map(x => x / max);

      return isNormalized ? distributionNormalized : distribution;
   }

   randomizeFromDistribution(distr: number[], isCumulative?: boolean): number[] {
      const rand = [];
      const cumulativeDistr = isCumulative ? distr : Z.cumulative(Z.sum, distr);
      const max = Z.max(cumulativeDistr);

      for (let j = 0; j < this.sampleSize; j++) {
         const rnd = random.int(0, max);

         cumulativeDistr.some((prob, i) => {
            if (rnd <= prob) {
               rand.push(i);
               return true;
            }
         });
      }

      return rand;
   }

   buildIntDistributionWithNegatives(data: number[]): number[] {
      const max = Math.max(...data);
      const min = Math.min(...data);
      const valueCounts = Z.valueCounts(data);
      const distribution = [];

      for (let i = min; i <= max; i++) {
         distribution.push({x: i, y: valueCounts[i] ? valueCounts[i] : 0});
      }

      return distribution;
   }

   getCol(colSet: Column[], colType: ColAddMode): Column {
      return colSet.find(col => col.meta.type === colType);
   }
}
