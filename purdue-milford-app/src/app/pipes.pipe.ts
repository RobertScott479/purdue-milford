import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedTime',
  standalone: true,
})
export class elapsedTime implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    let seconds = value; // parseInt(value, 10);

    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;

    return days + 'd, ' + hrs + 'h, ' + mnts + 'm, ' + seconds + 's';
  }
}

@Pipe({
  name: 'yesNoPipe',
  standalone: true,
})
export class yesNoPipe implements PipeTransform {
  transform(value: boolean, ...args: unknown[]): unknown {
    return value ? 'Yes' : 'No';
  }
}

@Pipe({
  name: 'okFailed',
  standalone: true,
})
export class okFailed implements PipeTransform {
  transform(value: boolean, ...args: unknown[]): unknown {
    // console.log(value)
    return value ? 'Ok' : 'Failed';
  }
}

@Pipe({
  name: 'Unix2ShortDate',
})
export class Unix2ShortDate implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    if (value <= 0) {
      return '';
    }
    const dt = formatDate(new Date(value * 1000), 'M/d/y h:mm:ss a', 'en-US');
    return dt;
  }
}
