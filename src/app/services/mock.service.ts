import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class MockService {
   demoFiles = [
      {
         name: 'RVI_novorozhdennykh',
         viewName: 'РВІ новонароджених',
         current: false
      },
      {
         name: 'RVI_Indonesia_1',
         viewName: 'РВІ Індонезія 1',
         current: false
      },
      {
         name: 'RVI_Indonesia_2',
         viewName: 'РВІ Індонезія 2',
         current: false
      },
      {
         name: 'Nehospit_pnevmonii',
         viewName: 'Негоспітальні пневмонії',
         current: false
      }
   ];

   get demoFile() {
      return this.demoFiles.find(file => file.current).name;
   }

   set demoFile(fileName: string) {
      this.demoFiles.forEach(file => file.current = false);
      this.demoFiles.find(file => file.name === fileName).current = true;
   }

   constructor(
      private http: HttpClient
   ) { }

   getMockData(fileName): Observable<any> {
      return this.http.get(`assets/json/${fileName}.json`);
   }
}
