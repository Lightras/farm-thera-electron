import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {MockService} from '../../services/mock.service';

@Component({
   selector: 'app-work-table',
   templateUrl: './work-table.component.html',
   styleUrls: ['./work-table.component.sass']
})
export class WorkTableComponent implements OnInit, OnChanges {
   @Input() showNormDays: boolean;
   @Input() normDays: number[];
   @Input() workData: Column[];

   withIndicator: boolean;

   constructor(
      private dataService: DataService,
      private mockService: MockService
   ) {
   }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (this.workData) {
         if (this.workData.some(d => d.meta.type === 'indicator')) {
            this.withIndicator = true;
         }
      }
   }
}
