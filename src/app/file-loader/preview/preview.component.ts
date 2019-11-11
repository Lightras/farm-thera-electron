import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
   selector: 'app-preview',
   templateUrl: './preview.component.html',
   styleUrls: ['./preview.component.sass']
})
export class PreviewComponent implements OnInit, OnChanges {
   @Input() data: any;
   @Input() titles: string[];

   constructor() { }

   ngOnChanges(changes: SimpleChanges): void {
   }

   ngOnInit() {
   }

}
