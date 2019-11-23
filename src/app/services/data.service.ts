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
   fullCalc: any;

   sampleSize = 1000;
   p: number;
   Se = 0.8;
   Sp = 0.9 ;
   seMin = 0.8;
   seMax = 1;
   spMin = 0.8;
   spMax = 1;

   constructor() { }

   getCol(colSet: Column[], colType: ColAddMode): Column {
      return colSet.find(col => col.meta.type === colType);
   }

   calcAB(data: Column[]) {
      const virusCol = this.getCol(data, 'virus');

      let dna;
      let dnb;
      let dva;
      let dvb;
      let dnaDistr;
      let dnbDistr;
      let dvaDistr;
      let dvbDistr;


      this.p = virusCol.data.reduce((withVirus, n) => withVirus + n, 0) / virusCol.data.length;

      [dna, dva, dnb, dvb] = this.getSubsets(data);

      dnaDistr = this.buildDistribution(dna);
      dvaDistr = this.buildDistribution(dva);
      dnbDistr = this.buildDistribution(dnb);
      dvbDistr = this.buildDistribution(dvb);

      const simulation = {
         dna: this.randomizeFromDistribution(dnaDistr),
         dva: this.randomizeFromDistribution(dvaDistr),
         dnb: this.randomizeFromDistribution(dnbDistr),
         dvb: this.randomizeFromDistribution(dvbDistr),
      };

      const costCriteriaBResults = [];
      const pBoundaryBResults = [];

      simulation.dna.forEach((v, i) => {
         const calcResults = this.calculate(simulation.dna[i], simulation.dva[i], simulation.dnb[i], simulation.dvb[i]);

         costCriteriaBResults.push(calcResults.costCriteriaB);
         pBoundaryBResults.push(calcResults.pBoundaryB);
      });

      this.fullCalc = {
         costCriteriaB: costCriteriaBResults,
         pBoundaryB: pBoundaryBResults,
      };

      return [
         this.fullCalc,
         dnaDistr,
         dvaDistr,
         dnbDistr,
         dvbDistr
      ];
   }

   calcABDB(data: Column[]) {
      const virusCol = this.getCol(data, 'virus');

      let dna;
      let dnb;
      let dva;
      let dvb;
      let dnaDistr;
      let dnbDistr;
      let dvaDistr;
      let dvbDistr;


      this.p = virusCol.data.reduce((withVirus, n) => withVirus + n, 0) / virusCol.data.length;

      [dna, dva, dnb, dvb] = this.getSubsets(data);

      dnaDistr = this.buildDistribution(dna);
      dvaDistr = this.buildDistribution(dva);
      dnbDistr = this.buildDistribution(dnb);
      dvbDistr = this.buildDistribution(dvb);

      const simulation = {
         dna: this.randomizeFromDistribution(dnaDistr),
         dva: this.randomizeFromDistribution(dvaDistr),
         dnb: this.randomizeFromDistribution(dnbDistr),
         dvb: this.randomizeFromDistribution(dvbDistr),
      };

      const costCriteriaDAResults = [];
      const costCriteriaDBResults = [];
      const pBoundaryDAResults = [];
      const pBoundaryDBResults = [];
      const pRange = [];

      simulation.dna.forEach((v, i) => {
         const calcResults = this.calculate(simulation.dna[i], simulation.dva[i], simulation.dnb[i], simulation.dvb[i]);

         costCriteriaDAResults.push(calcResults.costCriteriaDA);
         pBoundaryDAResults.push(calcResults.pBoundaryDA);
         costCriteriaDBResults.push(calcResults.costCriteriaDB);
         pBoundaryDBResults.push(calcResults.pBoundaryDB);
         pRange.push(calcResults.pBoundaryDB - calcResults.pBoundaryDA);
      });

      this.fullCalc = {
         costCriteriaDB: costCriteriaDBResults,
         costCriteriaDA: costCriteriaDAResults,
         pRange,
         pBoundaryDA: pBoundaryDAResults,
         pBoundaryDB: pBoundaryDBResults,
      };

      return this.fullCalc;
   }

   getValidSeSp(): [number, number] {
      const Se = random.float(this.seMin, this.seMax);
      const Sp = random.float(this.spMin, this.spMax);

      if ((Se / (1 - Sp)) > 1) {
         return [Se, Sp];
      } else {
         return this.getValidSeSp();
      }
   }

   calculate(dna: number, dva: number, dnb: number, dvb: number) {
      [this.Se, this.Sp] = this.getValidSeSp();

      const D_A = this.p * dva + (1 - this.p) * dna;
      const D_B = this.p * dvb + (1 - this.p) * dnb;
      const D_DB = this.p * (this.Se * dvb + (1 - this.Se) * dva) + (1 - this.p) * (this.Sp * dna + (1 - this.Sp) * dnb);

      const CD_to_C = random.float(0, 10);
      const CT_to_C = random.float(0, 10);


      const costCriteriaB = D_A - D_B;
      let pBoundaryB = (dna - dnb - CT_to_C) / (dvb - dnb + dna - dva);

      const costCriteriaDA = (D_A - D_DB - CD_to_C) / (this.p * this.Se + (1 - this.p) * (1 - this.Sp));
      const pBoundaryDA = ((1 - this.Sp) * (dna - dnb) - ((1 - this.Sp) * CT_to_C + CD_to_C)) /
         (this.Se * (dvb - dva) - (1 - this.Sp) * (dnb - dna) + (this.Se + this.Sp - 1) * CT_to_C);

      const costCriteriaDB = (D_B - D_DB - CD_to_C) / (this.p * this.Se + (1 - this.p) * (1 - this.Sp) - 1);
      const pBoundaryDB = (this.Sp * (dna - dnb) + CD_to_C - this.Sp * CT_to_C) /
         ((1 - this.Se) * (dvb - dva) - this.Sp * (dnb - dna) + (1 - this.Sp - this.Se) * CT_to_C);

      if (!isFinite(pBoundaryB)) {
         pBoundaryB = NaN;
      }

      return {
         costCriteriaB,
         costCriteriaDA,
         costCriteriaDB,
         pBoundaryB,
         pBoundaryDA,
         pBoundaryDB
      };
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

   getSubsets(data: Column[]): number[][] {
      const dva: number[] = [];
      const dna: number[] = [];
      const dvb: number[] = [];
      const dnb: number[] = [];

      if (data) {
         let daysColData;
         let virusColData;
         let therapyColData;

         data.forEach(col => {
            const colType = col.meta.type;

            if (colType === 'days') {
               daysColData = col.data;
            } else if (colType === 'virus') {
               virusColData = col.data;
            } else if (colType === 'therapy') {
               therapyColData = col.data;
            }
         });

         daysColData.forEach((v, i) => {
            switch ('' + virusColData[i] + therapyColData[i]) {
               case '00': {
                  dna.push(v);
                  break;
               }

               case '01': {
                  dnb.push(v);
                  break;
               }

               case '10': {
                  dva.push(v);
                  break;
               }

               case '11': {
                  dvb.push(v);
                  break;
               }
            }
         });

         return [dna, dva, dnb, dvb];
      }
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
