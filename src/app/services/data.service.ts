import { Injectable } from '@angular/core';
import {Column} from '../app.interfaces';

@Injectable({
   providedIn: 'root'
})
export class DataService {
   rawData: any;
   titles: string[];
   workData: Column[] = [];

   constructor() { }
}
