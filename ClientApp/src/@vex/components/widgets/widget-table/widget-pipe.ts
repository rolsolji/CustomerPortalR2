import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currency'
  })

  export class CurrencyPipe implements PipeTransform {
    transform(value: any, column: string): any {
        if(column === "CostPerShipment" || column === "TotalSpend")
        {
            value = value.toFixed(2);
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "$" + value;
        }
        else if(column === "CostPerPound")
        {
            value = value.toFixed(2);
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return value;
        }
        else{
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return value;
        }
      }
  }