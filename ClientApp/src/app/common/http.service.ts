import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { String, StringBuilder } from 'typescript-string-operations';
import { PostalData } from '../Entities/PostalData';
import { ClientDefaultData } from '../Entities/ClientDefaultData';
import { ProductPackageType } from '../Entities/ProductPackageType'
import { GetQuotesParameters } from '../Entities/getQuotesParameters';
import { Quote } from '../Entities/Quote';
import { EquipmentType } from '../Entities/EquipmentType';
import { ShipmentMode } from '../Entities/ShipmentMode'; 
import { Status } from '../Entities/Status';

@Injectable({
    providedIn: 'root'
})

export class HttpService{

    public token: string = '';
    constructor(private http: HttpClient){}

    getCountryList(keyId:string){        
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    async getMainToken(): Promise<string> {

        return new Promise((resolve, reject) => {
     
            let headers;
            let Ticket;
            this.http
            .get<Object>('https://beta-customer.r2logistics.com/Services/LoginService.svc/Json/DoLogin?Username=superadmin&Password=3500oaklawn&userType=C', {observe: 'response'})        
            .subscribe(resp => {                      
                console.log(resp.headers.get('ticket'));
                Ticket = resp.headers.get('ticket');
                const keys = resp.headers.keys();            
                // headers = keys.map(key =>
                //   `${key}: ${resp.headers.get(key)}`);
                
                //console.log(headers);            
                console.log(resp.body);
                resolve(Ticket);
            });        
     
     
       })
    }

    getToken(){
        let headers;
        let Ticket;
        this.http
        .get<Object>('https://beta-customer.r2logistics.com/Services/LoginService.svc/Json/DoLogin?Username=superadmin&Password=3500oaklawn&userType=C', {observe: 'response'})        
        .subscribe(resp => {         
            console.log(resp.headers.get('ticket'));
            const keys = resp.headers.keys();            
            headers = keys.map(key =>
              `${key}: ${resp.headers.get(key)}`);
            
            console.log(headers);            
            console.log(resp.body);
        });        

        return '';
    }

    // getToken(keyId:string){

    //     // let ticket = '28C144FA064090885C764FCB47F56ADC4658ADCE6C59DF238F7C4390ACB367D861B9AD9CF860EA2D3FAC4D26A4E8E92C00676429C756AFD8CD84B034D1217E588DEECF639ED681E21B83B95B516FA477AF03351FA395A2DFDA95D276EB3841CFABDA9BE429757ED63AE8CABAE7BA1C9BA181DC33434DB05D067C0467B8F5C5A361877AF549410DAE56EF9960755C20D03018A1223834E08829A55469EDA30131';
    //     // let httpHeaders = new HttpHeaders({
    //     //     'Content-Type' : 'application/json',
    //     //     'Access-Control-Allow-Origin' : '*',
    //     //     'Ticket' : ticket                            
    //     // }); 
    //     return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/LoginService.svc/Json/DoLogin?Username=superadmin&Password=3500oaklawn&userType=C')).toPromise();
    // }

    getStateDataByCountryId(countryId:string, keyId:string){
        let httpHeaders = new HttpHeaders({
            'Ticket' : this.token                           
        }); 
        return this.http.get(String.Format('https://customer.r2logistics.com/Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}&_={1}',countryId,keyId),{
            headers: httpHeaders
          });
    }

    getPostalDataByPostalCode(postalCode:string, countryId:string, keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<PostalData[]>(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}',postalCode,countryId,keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();        
    }
    
    getProductPackageType(keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise(); 

        //return this.http.get(String.Format('https://customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}',keyId))
    }

    getUserMessage(keyId:string){
        //return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId)).toPromise();
        return "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.";
    }

    getClientDefaultsByClient(clientID:number, keyId:string){        
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ClientDefaultData>(String.Format('https://beta-customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetClientDefaultsByClient?ClientID={0}&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();        
    }

    searchBOLHDRForJason(parameters:GetQuotesParameters){
        return this.http.post<Quote[]>('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/SearchBOLHDRForJason', parameters).toPromise();
    }

    getMasEquipment(keyId:string){
        return this.http.get<EquipmentType[]>(String.Format('https://customer.r2logistics.com/Services/BOLHDRService.svc/json/GetMasEquipment?_={0}',keyId)).toPromise();
    }

    getShipmentMode(keyId:string){
        return this.http.get<ShipmentMode[]>(String.Format('https://customer.r2logistics.com/Services/BOLHDRService.svc/json/GetShipmentMode?_={0}',keyId)).toPromise();
    }

    getBOLStatus(keyId:string){
        return this.http.get<Status[]>(String.Format('https://customer.r2logistics.com/Services/BOLHDRService.svc/json/GetBOLStatus?_={0}',keyId)).toPromise();
    }
}