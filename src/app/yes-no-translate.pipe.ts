import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNoTranslate'
})
export class YesNoTranslatePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return value ? 'Так' : 'Ні';
  }

}
