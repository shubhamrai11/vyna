// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'filter'
// })
// export class FilterPipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if (!items || !searchText) return items;

//     // lowercase + remove all spaces
//     const normalizedSearch = searchText.toLowerCase().replace(/\s+/g, '');

//     return items.filter(item =>
//       Object.values(item).some(val => {
//         if (val === null || val === undefined) return false;
//         return String(val).toLowerCase().replace(/\s+/g, '').includes(normalizedSearch);
//       })
//     );
//   }
// }












import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;

    const normalizedSearch = searchText.toLowerCase().replace(/\s+/g, '');

    return items.filter(item =>
      this.checkItem(item, normalizedSearch)
    );
  }

  private checkItem(item: any, search: string): boolean {
    if (item === null || item === undefined) return false;

    if (typeof item === 'object') {
      return Object.values(item).some(val => this.checkItem(val, search));
    }

    return String(item).toLowerCase().replace(/\s+/g, '').includes(search);
  }
}

