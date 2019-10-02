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

export interface BarData extends Array<number> {
   [index: number]: number;
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
      observation?: {
         id: number;
         day: number;
         title: string;
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

export type ColAddMode = 'days' | 'virus' | 'therapy' | 'indicator';
