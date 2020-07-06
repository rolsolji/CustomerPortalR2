export interface ProductFeatures{
    id: number | null;
    pallet:number;
    pieces:number;
    package:number;
    freightClass:number;
    nmfc:number;
    large:number;
    width:number;
    height:number;
    pcf:number;
    totalWeight:number;
    stackable:boolean;
    hazmat:boolean;
  }