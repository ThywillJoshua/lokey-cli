import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'sortKeyValueIntoArray',
})
export class SortKeyValueIntoArrayPipe implements PipeTransform {
  transform(
    obj: Record<string, any>,
    order: 'ASC' | 'DESC' = 'ASC'
  ): {
    key: string;
    value: any;
  }[] {
    if (!obj) return obj;

    // Sort the keys based on the provided order
    const sortedKeys = Object.keys(obj).sort((a, b) => {
      if (order === 'ASC') {
        return a.localeCompare(b); // Ascending order
      } else {
        return b.localeCompare(a); // Descending order
      }
    });

    // Create a new object with sorted keys
    const sortedObject: Record<string, any> = {};
    for (const key of sortedKeys) {
      sortedObject[key] = obj[key];
    }
    return Object.entries(sortedObject).map(([key, value]) => ({ key, value }));
  }
}
