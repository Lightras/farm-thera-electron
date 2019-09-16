import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as Z from 'zebras';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
     private http: HttpClient
  ) { }

  getMockData(): Observable<any> {
     return this.http.get('<assets/mock-data.json');
  }

  buildDistribution(data: number[], isNormalized?: boolean): number[] {
     const max = Math.max(...data);
     const valueCounts = Z.valueCounts(data);
     const distribution = [];

     for (let i = 0; i <= max; i++) {
        distribution.push(valueCounts[i] ? valueCounts[i] : 0);
     }

     const distributionNormalized = distribution.map(x => x / max);

     return isNormalized ? distributionNormalized : distribution;
  }
}
