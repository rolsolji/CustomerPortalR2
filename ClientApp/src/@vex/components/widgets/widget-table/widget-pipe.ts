import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'power'
  })

  export class PowerPipe implements PipeTransform {
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