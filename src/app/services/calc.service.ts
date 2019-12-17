import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import * as rnd from 'random';

@Injectable({
   providedIn: 'root'
})
export class CalcService {

   scatterWidth = 30;
   scatterDensity = 800;
   scatterX: number[];

   dna: number[];
   dva: number[];
   dnb: number[];
   dvb: number[];

   bounds = {
      Se: {
         min: 0.8,
         max: 0.9
      },
      Sp: {
         min: 0.8,
         max: 0.9
      },
      p: {
         min: 0.4,
         max: 0.6
      }
   };

   constructor(
      private dataService: DataService
   ) { }

   getSubsetsDistributions() {
      const virusCol = this.dataService.getCol(this.dataService.workData, 'virus');

      let dna;
      let dnb;
      let dva;
      let dvb;

      [dna, dva, dnb, dvb] = this.dataService.getSubsets(this.dataService.workData);

      [this.dna, this.dva, this.dnb, this.dvb] =
         [dna, dva, dnb, dvb].map(set => this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(set)));
   }

   findLineByLeastSquares(values_x: number[], values_y: number[]): {x: number, y: number}[] {
      let sum_x = 0;
      let sum_y = 0;
      let sum_xy = 0;
      let sum_xx = 0;
      let count = 0;

      let x = 0;
      let y = 0;
      const values_length = values_x.length;

      if (values_length !== values_y.length) {
         throw new Error('The parameters values_x and values_y need to have same size!');
      }

      /*
       * Calculate the sum for each of the parts necessary.
       */
      for (let v = 0; v < values_length; v++) {
         x = values_x[v];
         y = values_y[v];
         sum_x += x;
         sum_y += y;
         sum_xx += x * x;
         sum_xy += x * y;
         count++;
      }

      /*
       * Calculate m and b for the formular:
       * y = x * m + b
       */
      const m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
      const b = (sum_y / count) - (m * sum_x) / count;

      /*
       * We will make the x and y result line now
       */
      const result_values_x = [];
      const result_values_y = [];

      for (let v = 0; v < values_length; v++) {
         x = values_x[v];
         y = x * m + b;
         result_values_x.push(x);
         result_values_y.push(y);
      }

      return result_values_x.map((xv, i) => ({x: xv, y: result_values_y[i]}));
   }

   getScatterCtC() {
      const xData = this.getScatterX(0, 1);
      const xyData = [];

      console.log('xData: ', xData);

      xData.forEach(p => {
         for (let i = 1; i <= this.scatterWidth; i++) {
            xyData.push({
               x: p,
               y: this.calcCtC(
                  p,
                  // @ts-ignore
                  ...[this.dna, this.dva, this.dvb, this.dvb].map(d => d[rnd.int(0, this.dataService.sampleSize)])
               )
            });
         }
      });

      return xyData;
   }

   checkCtCdConditionA(dna, dva, dnb, dvb, p, Se, Sp, Ct_to_C, CD_to_C): boolean {
      const D_A = p * dva + (1 - p) * dna;
      const D_DB = p * (Se * dvb + (1 - Se) * dva) + (1 - p) * (Sp * dna + (1 - Sp) * dnb);

      return Ct_to_C < (D_A - D_DB - CD_to_C) / (p * Se + (1 - p) * (1 - Sp));
   }

   checkCtCdConditionB(dna, dva, dnb, dvb, p, Se, Sp, Ct_to_C, CD_to_C): boolean {
      const D_B = p * dvb + (1 - p) * dnb;
      const D_DB = p * (Se * dvb + (1 - Se) * dva) + (1 - p) * (Sp * dna + (1 - Sp) * dnb);

      return Ct_to_C < (D_B - D_DB - CD_to_C) / (p * Se + (1 - p) * (1 - Sp) - 1);
   }

   getRandomOtherValues() {
      const i = rnd.integer(0, this.dna.length);

      const [dna, dva, dnb, dvb] = [this.dna, this.dva, this.dnb, this.dvb].map(v => v[i]);

      const p = rnd.float(this.bounds.p.min, this.bounds.p.min);

      const [Se, Sp] = this.getValidSeSp();

      return [dna, dva, dnb, dvb, p, Se, Sp];
   }

   getDataABvsDB(key: 'A' | 'B') {
      let p;
      let Se;
      let Sp;
      let Ct_to_C;
      let Cd_to_C;
      let dna;
      let dva;
      let dnb;
      let dvb;

      const terminateThreshold = 0.1;
      const terminateLength = 5;
      const xDensity = 10;
      const yDensity = 100;
      const step = 1;

      let terminateConditionMet = false;
      const successRateHistory = [];
      let intervalStart = 0;
      let intervalEnd = 0;

      const AvsDB = [];

      let totalCount = 0;


      myWhile: while (!terminateConditionMet) {
         intervalStart = intervalEnd;
         intervalEnd = intervalStart + step;

         const internalStep = (intervalEnd - intervalStart) / xDensity;
         let successCount = 0;

         for (let i = 0; i < xDensity; i++) {
            const sumPoint = intervalStart + i * internalStep;
            Ct_to_C = rnd.float(0, sumPoint);
            Cd_to_C = sumPoint - Ct_to_C;

            for (let j = 0; j < yDensity; j++) {
               totalCount++;
               if (!(totalCount % 100000)) break myWhile;

               [dva, dvb, dna, dnb, p, Se, Sp] = this.getRandomOtherValues();

               if (key === 'A') {
                  successCount += Number(this.checkCtCdConditionA(dna, dva, dnb, dvb, p, Se, Sp, Ct_to_C, Cd_to_C));
               } else if (key === 'B') {
                  successCount += Number(this.checkCtCdConditionB(dna, dva, dnb, dvb, p, Se, Sp, Ct_to_C, Cd_to_C));
               } else {
                  return;
               }
            }
         }

         const successRate = successCount / (xDensity * yDensity);

         if (successRateHistory.length >= terminateLength) {
            successRateHistory.shift();
         }
         successRateHistory.push(successRate);

         AvsDB.push({
            x: intervalEnd,
            y: successRate
         });

         terminateConditionMet = (successRateHistory.length === terminateLength) && successRateHistory.every(v => v < terminateThreshold);

         console.log('successCount: ', successCount);
         console.log('successRate: ', successRate);
         console.log('AvsDB: ', AvsDB);
         console.log('successRateHistory: ', successRateHistory);
         console.log('------------------------------\n');
      }

      return AvsDB;
   }

   getValidSeSp(): [number, number] {
      const Se = rnd.float(this.bounds.Se.min, this.bounds.Se.max);
      const Sp = rnd.float(this.bounds.Sp.min, this.bounds.Sp.max);

      if ((Se / (1 - Sp)) > 1) {
         return [Se, Sp];
      } else {
         return this.getValidSeSp();
      }
   }

   getScatterX(min: number, max: number): number[] {
      const xArray = [];
      const step = (max - min) / this.scatterDensity;

      console.log('step: ', step);
      console.log('this.scatterDensity: ', this.scatterDensity);

      for (let i = 0; i <= this.scatterDensity; i++) {
         xArray.push(min + i * step);
      }

      return xArray;
   }

   calcCtC(p, dna, dva, dnb, dvb) {
      const D_A = p * dva + (1 - p) * dna;
      const D_B = p * dvb + (1 - p) * dnb;

      return D_A - D_B;
   }
}
