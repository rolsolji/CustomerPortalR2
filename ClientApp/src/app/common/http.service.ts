import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { String, StringBuilder } from 'typescript-string-operations';
import { PostalData } from '../Entities/PostalData';
import { ClientDefaultData } from '../Entities/ClientDefaultData';
import { ProductPackageType } from '../Entities/ProductPackageType'
import { GetQuotesParameters } from '../Entities/GetQuotesParameters';
import { SaveQuoteParameters } from '../Entities/SaveQuoteParameters';
import { SaveQuoteResponse } from '../Entities/SaveQuoteResponse'
import { Quote } from '../Entities/Quote';
import { EquipmentType } from '../Entities/EquipmentType';
import { ShipmentMode } from '../Entities/ShipmentMode'; 
import { Status } from '../Entities/Status';
import { AccessorialDetail } from '../Entities/AccessorialDetail';
import { ShipmentPriority } from '../Entities/ShipmentPriority';
import { ServiceLevelDetail } from '../Entities/ServiceLevelDetail';
import { PaymentTerm } from '../Entities/PaymentTerm';
import { ShipmentError } from '../Entities/ShipmentError';
import { ShipmentCost } from '../Entities/ShipmentCost';
import { Carrier } from '../Entities/Carrier';
import { ShipmentByLading } from '../Entities/ShipmentByLading';

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

    getStateDataByCountryId(countryId:string, keyId:string){
        let httpHeaders = new HttpHeaders({
            'Ticket' : this.token                           
        }); 
        return this.http.get(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}&_={1}',countryId,keyId),{
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
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.post<Quote[]>('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/SearchBOLHDRForJason', parameters
        ,{
            headers: httpHeaders
          }
          ).toPromise();  
    }

    getMasEquipment(keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<EquipmentType[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetMasEquipment?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise(); 

        //return this.http.get<EquipmentType[]>(String.Format('https://customer.r2logistics.com/Services/BOLHDRService.svc/json/GetMasEquipment?_={0}',keyId)).toPromise();
    }

    getShipmentMode(keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ShipmentMode[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetShipmentMode?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();    

        //return this.http.get<ShipmentMode[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetShipmentMode?_={0}',keyId)).toPromise();
    }

    getBOLStatus(keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<Status[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetBOLStatus?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise(); 
    }

    postalCodeAutocomplete(postalCode:string, countryId:string, keyId:string) {
        let opts = [];
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({ 'Ticket' : ticket });
        return (postalCode.length < 5) ?
            of(opts) :
            this.http.get<PostalData[]>(String.Format('https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}',postalCode,countryId,keyId)
                ,{headers: httpHeaders}
            ).pipe(tap(data => opts = data))
    }

    getGetClientMappedAccessorials(clientID:number, keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<AccessorialDetail[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json//GetClientMappedAccesorial?ClientID={0}&IsIncludeSystem=false&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();  
    }

    GetShipmentCostByLadingID(clientID:number, keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ShipmentCost>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetShipmentCostByLadingID?LadingID=2386472&_=1599193487557')
        ,{
            headers: httpHeaders
          }
          ).toPromise();  
    }

    saveQuote(parameters:SaveQuoteParameters){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.post<SaveQuoteResponse>('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/SaveQuote',parameters
        ,{
            headers: httpHeaders
        }
        ).toPromise();
    }

    getMasShipmentPriority(){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ShipmentPriority[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetMasShipmentPriority')
        ,{
            headers: httpHeaders
          }
          ).toPromise();            
    }

    getMasServiceLevel(clientID:number, keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ServiceLevelDetail[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetMasServiceLevel?ClientID={0}&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();            
    }

    getMasPaymentTerms(){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<PaymentTerm[]>(String.Format('https://beta-customer.r2logistics.com/Services/MasClientDefaultsService.svc/json/GetMasPaymentTerms')
        ,{
            headers: httpHeaders
          }
          ).toPromise();         
    }

    getShipmentError(keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ShipmentError[]>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/getShipmentError?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise(); 
    }

    getCarrierData(clientID:number, carrier:string, keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<Carrier[]>(String.Format('https://beta-customer.r2logistics.com/Services/CarrierService.svc/json/GetMasCarrierByCarrierCodeOrName?clientID={0}&CarrierCodeorName={1}&_={2}',clientID.toString(),carrier,keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();        
    }
    
    carrierAutocomplete(clientID:number, carrier:string, keyId:string) {
        let opts = [];
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({ 'Ticket' : ticket });
        return (carrier.length < 4) ?
            of(opts) :
            this.http.get<Carrier[]>(String.Format('https://beta-customer.r2logistics.com/Services/CarrierService.svc/json/GetMasCarrierByCarrierCodeOrName?clientID={0}&CarrierCodeorName={1}&_={2}',clientID.toString(),carrier,keyId)
                ,{headers: httpHeaders}
            ).pipe(tap(data => opts = data))
    }

    GetShipmentByLadingID(LadingID:string, keyId:string){
        let ticket = this.token;
        let httpHeaders = new HttpHeaders({                       
            'Ticket' : ticket                            
        }); 
        return this.http.get<ShipmentByLading>(String.Format('https://beta-customer.r2logistics.com/Services/BOLHDRService.svc/json/GetShipmentByLadingID?LadingID={0}&_={1}',LadingID,keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();            
    }

}