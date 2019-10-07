import { Pipe, PipeTransform } from '@angular/core';
import {ColAddMode} from './app.interfaces';
import {isNull} from 'util';

@Pipe({
   name: 'yesNoTranslate'
})
export class YesNoTranslatePipe implements PipeTransform {

   transform(value: number, valueType: ColAddMode, normBound?: number, isNormHigher?: boolean): any {
      let translation = '';

      switch (valueType) {
         case 'virus':
         case 'therapy': {
            translation = value ? 'Так' : 'Ні';
            break;
         }

         case 'indicator': {
            if (value === normBound) {
               translation = 'Норма';
            } else {
               translation = !((value > normBound) || isNormHigher) ? 'Норма' : 'Не норма';
            }
            break;
         }

         default: {
            translation = value as any;
         }
      }

      return translation;
   }

}
