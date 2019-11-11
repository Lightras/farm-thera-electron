import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
   selector: 'app-norm-config',
   templateUrl: './norm-config.component.html',
   styleUrls: ['./norm-config.component.sass']
})
export class NormConfigComponent implements OnInit, OnChanges {
   @Input() normConfig: any[];

   @Output() normConfigChange: EventEmitter<any> = new EventEmitter<any>();

   constructor() { }

   ngOnInit() {
   }

   ngOnChanges(changes: SimpleChanges): void {
   }

   saveNormConfig() {
      this.normConfigChange.emit(this.normConfig);
   }
}
