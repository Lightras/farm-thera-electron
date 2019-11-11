import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class DataService {
   rawData: any;
   titles: string[];

   constructor() { }
}
