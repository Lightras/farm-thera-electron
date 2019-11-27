import { Component, OnInit } from '@angular/core';
import {MockService} from '../services/mock.service';
import {DataService} from '../services/data.service';
import {Router} from '@angular/router';

@Component({
   selector: 'app-demo',
   templateUrl: './demo.component.html',
   styleUrls: ['./demo.component.sass']
})
export class DemoComponent implements OnInit {

   demoFiles: any[];

   constructor(
      private mockService: MockService,
      private dataService: DataService,
      private router: Router,
   ) {
      this.demoFiles = mockService.demoFiles;
   }

   ngOnInit() {
   }

   showDemoFor(demoFileName: string) {
      this.mockService.demoFile = demoFileName;

      this.mockService.getMockData(demoFileName).subscribe(d => {
         this.dataService.workData = d;

         this.router.navigate(['calc-and-analysis']);
      });
   }

}
