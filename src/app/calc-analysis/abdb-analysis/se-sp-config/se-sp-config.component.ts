import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../../../services/data.service';

@Component({
   selector: 'app-se-sp-config',
   templateUrl: './se-sp-config.component.html',
   styleUrls: ['./se-sp-config.component.sass']
})
export class SeSpConfigComponent implements OnInit {
   @Input() seMin = 0.8;
   @Input() seMax = 1;
   @Input() spMin = 0.8;
   @Input() spMax = 1;

   showError: boolean;

   @Output() seSpChange: EventEmitter<any> = new EventEmitter<any>();

   constructor(
   ) { }

   ngOnInit() {
   }

   submitSeSp() {
      this.showError =
         this.seMin > this.seMax || this.spMin > this.spMax || (!this.seMin && !this.seMax) || (!this.spMin && !this.spMax);

      if (!this.showError) {
         this.seSpChange.emit({
            seMin: this.seMin,
            seMax: this.seMax,
            spMin: this.spMin,
            spMax: this.spMax
         });
      }
   }

   onSeSpChange() {
      this.showError = false;
   }
}
