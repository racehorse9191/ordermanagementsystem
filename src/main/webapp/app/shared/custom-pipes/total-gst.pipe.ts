import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'totalGst' })
export class TotalGstPipe implements PipeTransform {
  constructor() {}

  transform(total: any, of: number, sumEnable: boolean) {
    const sum = (total * of) / 100;
    console.log('sum=>', sum);
    if (sumEnable) {
      return total + sum;
    } else {
      return sum;
    }
  }
}
