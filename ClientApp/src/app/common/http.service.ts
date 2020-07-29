import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { String, StringBuilder } from 'typescript-string-operations';
import { PostalData } from '../Entities/PostalData';
import { ClientDefaultData } from '../Entities/ClientDefaultData';
import { ProductPackageType } from '../Entities/ProductPackageType'
import { GetQuotesParameters } from '../Entities/getQuotesParameters';
import { Quote } from '../Entities/Quote';

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

    getUserMessage(keyId:string){
        //return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId)).toPromise();
        return "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.";
    }

    getClientDefaultsByClient(clientID:number, keyId:string){
        return this.http.get<ClientDefaultData>(String.Format('https://customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetClientDefaultsByClient?ClientID={0}&_={1}',clientID.toString(),keyId)).toPromise();
    }

    getBOLHDRForJason(parameters:GetQuotesParameters){
        return this.http.post<Quote[]>('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetBOLHDRForJason', parameters).toPromise();
    }
}