import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, propName: string) {
    if (value) {
      const resultArray = [];
      for (const item of value) {
        if (item[propName].toLowerCase().includes(filterString.toLowerCase())) {
          resultArray.push(item);
        }
      }
      return resultArray;
    }

    return value
  }

}
