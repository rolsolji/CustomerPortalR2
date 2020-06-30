import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { strict } from 'assert';
import { String, StringBuilder } from 'typescript-string-operations';

@Injectable({
    providedIn: 'root'
})

export class HttpService{

    constructor(private http: HttpClient){}

    getContryList(keyId:string){
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId));
    }

    getStateDataByCountryId(countryId:string, keyId:string){
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}&_={1}',countryId,keyId));
    }

    getPostalDataByPostalCode(postalCode:string, countryId:string, keyId:string){
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}',postalCode,countryId,keyId));
    }
    
    getProductPackageType(keyId:string){
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}',keyId))
    }
   
}