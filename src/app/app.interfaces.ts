export interface DataObj {
   data: any[];
   errors: any[];
   meta: {
      fields: string[]
   };
}

export interface PieData extends Array<[string, number]> {
   [index: number]: [string, number];
}

export interface BarData extends Array<any> {
   [index: number]: {x: number, y: number};
}

export interface ChartTitles {
   chartTitle: string;
   xAxisTitle?: string;
   yAxisTitle?: string;
}

export interface Column {
   data: any[];
   meta?: {
      title: string;
      type: ColAddMode;
      mainCol?: boolean;
      initialColIndex?: number,
      observation?: {
         id: number;
         day: number;
         title: string;
      },
      norm?: {
         boundaryValue: number,
         isGreaterThanBoundary: boolean
      }
   };
}

export interface Indicators {
   days: number[];
   ids: number[];
   indicators: {
      id: number;
      title: string;
   }[];
}

export class CalcResults2 {
   normDays: number[];
   daData: Column[];
   dbData: Column[];
   da: number[];
   db: number[];
   simulatedCohortTotal: number[];
   simulatedCohortDistrTotal: number[];
   simulatedCohortA: number[];
   simulatedCohortB: number[];
   simulatedCohortDistrA: number[];
   simulatedCohortDistrB: number[];
   criteriaB: number[];
   criteriaDistrB: number[];
}

export type ColAddMode = 'days' | 'virus' | 'therapy' | 'indicator';
