import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { String, StringBuilder } from 'typescript-string-operations';
import { PostalData } from '../Entities/PostalData';
import { ProductPackageType } from '../Entities/ProductPackageType'

@Injectable({
    providedIn: 'root'
})

export class HttpService{

    constructor(private http: HttpClient){}

    getContryList(keyId:string){
        return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId)).toPromise();
    }

    getStateDataByCountryId(countryId:string, keyId:string){
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}&_={1}',countryId,keyId));
    }

    getPostalDataByPostalCode(postalCode:string, countryId:string, keyId:string){
        return this.http.get<PostalData[]>(String.Format('https://customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}',postalCode,countryId,keyId)).toPromise();
    }
    
    getProductPackageType(keyId:string){
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}',keyId))
    }

    async getProductPackageTypeN(keyId:string): Promise<ProductPackageType[]>{
        try{
            let response = await this.http.get(String.Format('https://customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}',keyId))
                .toPromise();
            return response.json().data as ProductPackageType[];
        } catch (error) {
            //await this.handleError(error);
        }

    }
   
}