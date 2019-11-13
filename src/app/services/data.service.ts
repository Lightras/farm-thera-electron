import { Injectable } from '@angular/core';
import {ColAddMode, Column} from '../app.interfaces';
import * as deepcopy from 'deepcopy';
import * as Z from 'zebras';
import * as random from 'random';

@Injectable({
   providedIn: 'root'
})
export class DataService {
   rawData: any;
   titles: string[];
   workData: Column[] = [];
   normDays: number[];

   sampleSize = 1000;

   constructor() { }

   getCol(colSet: Column[], colType: ColAddMode): Column {
      return colSet.find(col => col.meta.type === colType);
   }

   getSubSetsTherapy(workData: Column[], normDays?: number[]) {
      const da = [];
      const db = [];

      const therapyCol = this.getCol(workData, 'therapy');
      const daysCol = this.getCol(workData, 'days');

      const daIndex = [];
      const dbIndex = [];

      const daysData = normDays ? normDays : daysCol.data;

      daysData.forEach((d, i) => {
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

   normalizeXY(data: {x: number, y: number}[], total?: number): {x: number, y: number}[] {
      const sum = data.reduce((accum, n) => accum + n.y, 0);
      return data.map(n => ({x: n.x, y: n.y / (total ? total : sum)}));
   }

   buildDistribution(data: number[], isNormalized?: boolean, includeNegative?: boolean): number[] {
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
}
