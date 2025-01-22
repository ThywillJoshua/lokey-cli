import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'convertObjectIntoArray',
  pure: true,
})
export class ConvertObjectIntoArrayPipe implements PipeTransform {
  transform(obj: Record<string, any>): {
    key: string;
    value: any;
  }[] {
    if (!obj) return obj;

    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}
