import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Array<any> , key :string , value: string): unknown {
    let result;
    if(value && value !== ''){
      result = _.filter(items,(item)=>item[key] === value)
    } else {
      result = items;
    }
    return result;
  }

}
