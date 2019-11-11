import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normDay'
})
export class NormDayPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return isNaN(value) ? '-' : value;
  }

}
