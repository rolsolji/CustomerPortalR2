import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currency'
  })

  export class CurrencyPipe implements PipeTransform {
    transform(value: any, column: string): any {
        if(column === "CostPerShipment" || column === "TotalSpend")
        {
            return "$" + value;
        }
        else
        {
            return value;
        }
      }
  }