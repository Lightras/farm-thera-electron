import {Injectable} from '@angular/core';
import * as Z from 'zebras';
import * as random from 'random';
import {CalcResults2, Column} from '../app.interfaces';
import {DataService} from './data.service';

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

   calculation2(da, db) {
      return da.map((x, i) => da[i] - db[i]);
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

   performCalc(workData, normDays) {
      const normCalcResults = {
         byDays: this.getCalcResults(workData, normDays, 'days'),
         byNorm: this.getCalcResults(workData, normDays, 'norm'),
      };

      let residualDays = 1000;
      let residualNorm = 1000;
      let dD;
      let dN;
      let normDataFixed;
      let humanDaysDays = 0;
      let humanDaysNorm = 0;

      normCalcResults.byNorm.simulatedCohortDistrTotal.forEach((v, i) => {
         if (normDataFixed) {
            normCalcResults.byNorm.simulatedCohortDistrTotal[i] = normCalcResults.byDays.simulatedCohortDistrTotal[i];
         }

         dD = normCalcResults.byDays.simulatedCohortDistrTotal[i];
         dN = normCalcResults.byNorm.simulatedCohortDistrTotal[i];

         residualDays -= dD;
         residualNorm -= dN;

         if (i > 14 && !normDataFixed && residualNorm > residualDays) {
            console.log('normDataFixed: ', normDataFixed);
            console.log('residualNorm: ', residualNorm);
            console.log('residualDays: ', residualDays);

            const diff = residualNorm - residualDays;
            residualNorm = residualDays;
            normCalcResults.byNorm.simulatedCohortDistrTotal[i] += diff;
            normDataFixed = true;
         }

         humanDaysDays += residualDays;
         humanDaysNorm += residualNorm;
      });
   }

   normSimulation(dataSet, normDays) {
      const daysCol = dataSet.find(col => col.meta.type === 'days');
      const maxDays = Z.max(daysCol.data);
      const counts = Z.valueCounts(normDays);
      const countsArray = [0, 5, 14, maxDays].map(d => {
         return {
            day: d,
            count: (d === maxDays) ? counts.NaN : counts[d] || 0,
            cumCount: 0
         };
      });
      countsArray.sort((a, b) => a.day - b.day);
      countsArray.forEach((v, i) => {
         if (i) {
            v.cumCount = countsArray[i - 1].cumCount + v.count;
         } else {
            v.cumCount = v.count;
         }
      });

      [0, 5, 14, maxDays].forEach(d => {
         if (typeof counts[d] === 'undefined') {
            if ([0, 5, 14].includes(d)) {
               counts[d] = 0;
            } else {
               counts[d] = counts.NaN;
            }
         }
      });

      const simulatedDistribution = Array(maxDays);
      countsArray.forEach((c, i) => {
         simulatedDistribution[c.day] = c.cumCount;

         let leap;
         let daysDiff;
         let step;

         if (countsArray[i + 1]) {
            leap = countsArray[i + 1].count;
            daysDiff = countsArray[i + 1].day - countsArray[i].day;
            step = leap / (daysDiff);

            for (let j = 0; j < daysDiff; j++) {
               if (j) {
                  simulatedDistribution[c.day + j] = c.cumCount + step * j;
               }
            }
         }
      });

      // this.simulatedDistribution = simulatedDistribution;
      const simulatedCohort = this.randomizeFromDistribution(simulatedDistribution, this.dataService.sampleSize, true);
      const simulatedCohortValueCounts = Z.valueCounts(simulatedCohort);
      const simulatedCohortMaxValue = Z.max(simulatedCohort);
      const simulatedCohortDistr = [];
      for (let i = 0; i <= simulatedCohortMaxValue; i++) {
         simulatedCohortDistr.push(simulatedCohortValueCounts[i] ? simulatedCohortValueCounts[i] : 0);
      }
      // this.simulatedCohortDistr = simulatedCohortDistr;

      return [simulatedCohortDistr, simulatedCohort];
   }

   getCalcResults(data: Column[], normDays: number[], type: 'norm' | 'days'): CalcResults2 {
      const calcResults: CalcResults2 = {
         normDays: null,
         daData: null,
         dbData: null,
         da: null,
         db: null,
         simulatedCohortTotal: null,
         simulatedCohortDistrTotal: null,
         simulatedCohortA: null,
         simulatedCohortB: null,
         simulatedCohortDistrA: null,
         simulatedCohortDistrB: null,
         criteriaB: null,
         criteriaDistrB: null,
      };

      if (type === 'days') {
         normDays = this.dataService.getCol(data, 'days').data;
      }

      [
         calcResults.daData,
         calcResults.dbData,
         calcResults.da,
         calcResults.db
      ] = this.dataService.getSubSetsTherapy(data, normDays);

      if (type === 'norm') {
         [calcResults.simulatedCohortDistrA, calcResults.simulatedCohortA] = this.normSimulation(calcResults.daData, calcResults.da);
         console.log('calcResults.daData: ', calcResults.daData);
         console.log('calcResults.da: ', calcResults.da);
         console.log('calcResults.simulatedCohortA: ', calcResults.simulatedCohortA);
         [calcResults.simulatedCohortDistrB, calcResults.simulatedCohortB] = this.normSimulation(calcResults.dbData, calcResults.db);
         [calcResults.simulatedCohortDistrTotal, calcResults.simulatedCohortTotal] = this.normSimulation(data, normDays);
      } else {

         calcResults.simulatedCohortA =
            this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(calcResults.da));
         calcResults.simulatedCohortB =
            this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(calcResults.db));
         calcResults.simulatedCohortTotal =
            this.dataService.randomizeFromDistribution(this.dataService.buildDistribution(normDays));

         calcResults.simulatedCohortDistrA = this.dataService.buildDistribution(calcResults.simulatedCohortA);
         calcResults.simulatedCohortDistrB = this.dataService.buildDistribution(calcResults.simulatedCohortB);
         calcResults.simulatedCohortDistrTotal = this.dataService.buildDistribution(calcResults.simulatedCohortTotal);
      }

      calcResults.criteriaB = this.calculation2(calcResults.simulatedCohortA, calcResults.simulatedCohortB);
      calcResults.criteriaDistrB = this.dataService.buildIntDistributionWithNegatives(calcResults.criteriaB);

      return calcResults;
   }
}
