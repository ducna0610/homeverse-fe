import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago',
  standalone: true,
})
export class TimeagoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const time = new Date(value);
      const now = new Date();
      const strTime = ["giây", "phút", "giờ", "ngày", "tháng", "năm"];
      const length = [60, 60, 24, 30, 12, 9999];

      var diff = (now.getTime() - time.getTime()) / 1000;

      for (var i = 0; diff >= length[i] && i < length.length - 1; i++) {
        diff /= length[i];
      }
      value = Math.floor(diff) + " " + strTime[i] + " trước";
    }
    return value;
  }

}
