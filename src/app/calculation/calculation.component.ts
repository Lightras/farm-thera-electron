import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Column} from '../app.interfaces';
import * as Z from 'zebras';
// @ts-ignore
import * as random from 'random';
import {DataServiceOld} from '../data-service-old.service';

@Component({
   selector: 'app-calculation',
   templateUrl: './calculation.component.html',
   styleUrls: ['./calculation.component.sass']
})
export class CalculationComponent implements OnInit, OnChanges {
   @Input() workData: Column[];
   // @Output() calcResults: EventEmitter<any> = new EventEmitter<any>();

   dna: number[];
   dva: number[];
   dnb: number[];
   dvb: number[];

   p: number;
   Se = 0.8;
   Sp = 0.9 ;

   dnaDistr: number[];
   dvaDistr: number[];
   dnbDistr: number[];
   dvbDistr: number[];

   calcResults: any;

   hypothesis = [];


   constructor(
      private dataService: DataServiceOld
   ) { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      // @ts-ignore
      window.s = this;

      if (changes.workData && changes.workData.currentValue) {
         console.log('this.workData calculation', this.workData);

         const virusCol = this.dataService.getCol(this.workData, 'virus');

         this.p = virusCol.data.reduce((withVirus, n) => withVirus + n, 0) / virusCol.data.length;

         [this.dna, this.dva, this.dnb, this.dvb] = this.getSubsets(this.workData);

         this.dnaDistr = this.buildDistribution(this.dna);
         this.dvaDistr = this.buildDistribution(this.dva);
         this.dnbDistr = this.buildDistribution(this.dnb);
         this.dvbDistr = this.buildDistribution(this.dvb);

         const N = 10000;

         const simulation = {
            dna: this.randomizeFromDistribution(this.dnaDistr, N),
            dva: this.randomizeFromDistribution(this.dvaDistr, N),
            dnb: this.randomizeFromDistribution(this.dnbDistr, N),
            dvb: this.randomizeFromDistribution(this.dvbDistr, N),
         };

         const costCriteriaBResults = [];
         const costCriteriaDAResults = [];
         const costCriteriaDBResults = [];
         const pBoundaryBResults = [];
         const pBoundaryDAResults = [];
         const pBoundaryDBResults = [];
         const pRange = [];

         simulation.dna.forEach((v, i) => {
            const calcResults = this.calculate(simulation.dna[i], simulation.dva[i], simulation.dnb[i], simulation.dvb[i]);

            costCriteriaBResults.push(calcResults.costCriteriaB);
            pBoundaryBResults.push(calcResults.pBoundaryB);
            costCriteriaDAResults.push(calcResults.costCriteriaDA);
            pBoundaryDAResults.push(calcResults.pBoundaryDA);
            costCriteriaDBResults.push(calcResults.costCriteriaDB);
            pBoundaryDBResults.push(calcResults.pBoundaryDB);
            pRange.push(calcResults.pBoundaryDB - calcResults.pBoundaryDA);
         });

         this.calcResults = {
            costCriteriaB: costCriteriaBResults,
            costCriteriaDB: costCriteriaDBResults,
            costCriteriaDA: costCriteriaDAResults,
            pRange,
            pBoundaryB: pBoundaryBResults,
         };

         // console.log('costCriteriaBResults: ', costCriteriaBResults);
         // console.log('costCriteriaDAResults: ', costCriteriaDAResults);
         // console.log('costCriteriaDBResults: ', costCriteriaDBResults);
         //
         // console.log('pBoundaryBResults: ', pBoundaryBResults);
         // console.log('pBoundaryDAResults: ', pBoundaryDAResults);
         // console.log('pBoundaryDBResults: ', pBoundaryDBResults);
         //
         // console.log('pRange: ', pRange);
      }
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

   buildDistribution(data: number[], isNormalized?: boolean, total?: number): number[] {
      const max = Math.max(...data);
      const valueCounts = Z.valueCounts(data);
      const distribution = [];

      for (let i = 0; i <= max; i++) {
         distribution.push(valueCounts[i] ? valueCounts[i] : 0);
      }

      const sum = distribution.reduce((s, n) => s + n);
      const distributionNormalized = distribution.map(x => x / (total ? total : sum));

      return isNormalized ? distributionNormalized : distribution;
   }

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

   getValidSeSp(): [number, number] {
      const Se = random.float(0.8, 1);
      const Sp = random.float(0.8, 1);

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
}
