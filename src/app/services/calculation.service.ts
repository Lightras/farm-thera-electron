import { Injectable } from '@angular/core';
import * as Z from 'zebras';
import * as random from 'random';
import * as superRandom from 'random-js';
import {Column} from '../app.interfaces';
import {DataServiceOld} from '../data-service-old.service';
import * as deepcopy from 'deepcopy';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(
     private dataService: DataServiceOld
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

   calculation2(da, db) {
      // return da.map((x, i) => da[i] - db[i]);
      // return da.map((x, i) => da[i] - db[i]);
      return da.map((x, i) => da[i]);
   }

   recalcNormDays(normConfig, dataSet) {
      const normDays = [];
      const indicatorDays = [0, 5, 14];

      dataSet[0].data.forEach((v, i) => {
         let normDay = NaN;
         let indicatorDayCol: Column;

         indicatorDays.some(d => {
            let isNorm = true;

            normConfig.forEach(indicator => {
               if (indicator.normConfig) {
                  indicatorDayCol = dataSet.find(col => {
                     return col.meta.observation.id === indicator.id && col.meta.observation.day === d;
                  });

                  isNorm = isNorm && !!indicatorDayCol.data[i];
               }
            });

            if (isNorm) {
               normDay = d;
               return true;
            }
         });

         normDays.push(normDay);
      });

      return normDays;
   }
}
