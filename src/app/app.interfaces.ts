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
   xAxisTitle: string;
   yAxisTitle: string;
}
