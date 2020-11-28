import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {BehaviorSubject, Observable, of} from 'rxjs';
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
import { ShipmentResponse } from '../Entities/ShipmentResponse';
import { ShipmentByLading } from '../Entities/ShipmentByLading';
import {User} from '../Entities/user.model';
import {environment} from '../../environments/environment';
import {AuthenticationService} from './authentication.service';
import { ReferenceByClient } from '../Entities/ReferenceByClient';
import {MasUser} from '../Entities/mas-user.model';
import { SendEmailParameters } from '../Entities/SendEmailParameters';
import { SendEmailResponse } from '../Entities/SendEmailResponse';
import { SaveQuoteData } from '../Entities/SaveQuoteData';
import { StatusReason } from '../Entities/StatusReason';
import {GetLocationsParameters} from "../Entities/GetLocationsParameters";
import {Location} from "../Entities/Location";
import { TrackingDetails } from '../Entities/TrackingDetails';
import {Country} from "../Entities/Country";

@Injectable({
    providedIn: 'root'
})

export class HttpService{

    public token = '';
    private baseEndpoint: string;
    constructor(
      private http: HttpClient,
      private authenticationService: AuthenticationService
    ){
      this.authenticationService.init();
      this.token = this.authenticationService.ticket$.value;
      this.baseEndpoint = environment.baseEndpoint;
    }

    getCountryList(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<Country[] | Country>(
          String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getMasUserStatus() {
      const ticket = this.token;
      const httpHeaders = new HttpHeaders({
        Ticket : ticket
      });
      return this.http.get(
        this.baseEndpoint + 'Services/MASUserService.svc/json/GetMasUserStatus'
        ,{
          headers: httpHeaders
        }
      ).toPromise();
    }

    // Locations Methods
    getMasLocations(parameters: GetLocationsParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        console.log(parameters);
        return this.http.post<Location[]>(this.baseEndpoint + 'Services/MasLocationService.svc/json/GetMasLocation', parameters
            ,{
                headers: httpHeaders
            }
        ).toPromise();
    }

    UpdateMasLocation(parameters: GetLocationsParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        console.log(parameters);
        return this.http.post<Location[]>(this.baseEndpoint + 'Services/MasLocationService.svc/json/UpdateMasLocation', parameters
            ,{
                headers: httpHeaders
            }
        ).toPromise();
    }

    GetMasLocationType() {
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get(
            this.baseEndpoint + 'Services/MasLocationService.svc/json/GetMasLocationType'
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
            .get<Object>(this.baseEndpoint + 'Services/LoginService.svc/Json/DoLogin?Username=superadmin&Password=3500oaklawn&userType=C', {observe: 'response'})
            .subscribe(resp => {
                Ticket = resp.headers.get('ticket');
                const keys = resp.headers.keys();
                // headers = keys.map(key =>
                //   `${key}: ${resp.headers.get(key)}`);

                resolve(Ticket);
            });


       })
    }

    getStateDataByCountryId(countryId:string, keyId:string){
        const httpHeaders = new HttpHeaders({
            Ticket : this.token
        });
        countryId = countryId !== '' ? countryId : '1';
        return this.http.get(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}',countryId),{
            headers: httpHeaders
          }).toPromise();
    }

    getPostalDataByPostalCode(postalCode:string, countryId:string, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<PostalData[]>(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}',postalCode,countryId,keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getProductPackageType(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ProductPackageType[]>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getUserMessage(keyId:string){
        // return this.http.get(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}',keyId)).toPromise();
        return 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.';
    }

    getClientDefaultsByClient(clientID:number, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ClientDefaultData>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetClientDefaultsByClient?ClientID={0}&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    searchBOLHDRForJason(parameters:GetQuotesParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<Quote[]>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/SearchBOLHDRForJason', parameters
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    updateMasUser(masUser: MasUser){
      const ticket = this.token;
      const httpHeaders = new HttpHeaders({
        Ticket : ticket
      });
      return this.http.post<any>(this.baseEndpoint + 'Services/MASUserService.svc/json/UpdateMasUser',
        masUser
        ,{
          headers: httpHeaders
        }
      ).toPromise();
    }



    getMasEquipment(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<EquipmentType[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetMasEquipment?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();

        // return this.http.get<EquipmentType[]>(String.Format('https://customer.r2logistics.com/Services/BOLHDRService.svc/json/GetMasEquipment?_={0}',keyId)).toPromise();
    }

    getShipmentMode(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ShipmentMode[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentMode?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();

        // return this.http.get<ShipmentMode[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentMode?_={0}',keyId)).toPromise();
    }

    getBOLStatus(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<Status[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetBOLStatus?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    postalCodeAutocomplete(postalCode:string, countryId:string, keyId:string) {
        let opts = [];
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({ Ticket : ticket });
        return (postalCode.length < 5) ?
            of(opts) :
            this.http.get<PostalData[]>(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}',postalCode,countryId,keyId)
                ,{headers: httpHeaders}
            ).pipe(tap(data => opts = data))
    }

    getGetClientMappedAccessorials(clientID:number, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<AccessorialDetail[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json//GetClientMappedAccesorial?ClientID={0}&IsIncludeSystem=false&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    GetShipmentCostByLadingID(LadingID:string, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ShipmentCost>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentCostByLadingID?LadingID={0}&_={1}',LadingID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    saveQuote(parameters:SaveQuoteParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<SaveQuoteResponse>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/SaveQuote',parameters
        ,{
            headers: httpHeaders
        }
        ).toPromise();
    }

    saveNewQuote(parameters:SaveQuoteData){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<SaveQuoteResponse>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/SaveQuote',parameters
        ,{
            headers: httpHeaders
        }
        ).toPromise();
    }

    getMasShipmentPriority(){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ShipmentPriority[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetMasShipmentPriority')
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getMasServiceLevel(clientID:number, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ServiceLevelDetail[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetMasServiceLevel?ClientID={0}&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getMasPaymentTerms(){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<PaymentTerm[]>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetMasPaymentTerms')
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getShipmentError(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ShipmentError[]>(
          String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/getShipmentError?_={0}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    getCarrierData(clientID:number, carrier:string, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<Carrier[]>(String.Format(this.baseEndpoint + 'Services/CarrierService.svc/json/GetMasCarrierByCarrierCodeOrName?clientID={0}&CarrierCodeorName={1}&_={2}',clientID.toString(),carrier,keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    carrierAutocomplete(clientID:number, carrier:string, keyId:string) {
        let opts = [];
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({ Ticket : ticket });
        return (carrier.length < 4) ?
            of(opts) :
            this.http.get<Carrier[]>(String.Format(this.baseEndpoint + 'Services/CarrierService.svc/json/GetMasCarrierByCarrierCodeOrName?clientID={0}&CarrierCodeorName={1}&_={2}',clientID.toString(),carrier,keyId)
                ,{headers: httpHeaders}
            ).pipe(tap(data => opts = data))
    }

    GetShipmentByLadingID(LadingID:string, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ShipmentByLading>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentByLadingID?LadingID={0}&_={1}',LadingID,keyId)

        ,{
            headers: httpHeaders
          }
        ).toPromise();
    }

    getTrackingDetailsByLadingID(landingId:string,keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<TrackingDetails[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetTrackingDetailsByLadingID?LadingID={0}&_={1}', landingId, keyId)
        ,{
            headers: httpHeaders
          }
        ).toPromise();
    }

    GetReferenceByClient(clientID:number, keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<ReferenceByClient[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json//GetReferenceByClient?ClientID={0}&_={1}',clientID.toString(),keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    SendBolConfirmation(parameters: SendEmailParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<SendEmailResponse>(this.baseEndpoint + 'Services/SendEmailService.svc/json/SendBolConfirmation',parameters
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    SendMailLabelManually(parameters: SendEmailParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<SendEmailResponse>(this.baseEndpoint + 'Services/SendEmailService.svc/json/SendMailLabelManually',parameters
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    SendEmailManually(parameters: SendEmailParameters){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<SendEmailResponse>(this.baseEndpoint + 'Services/SendEmailService.svc/json/SendEmailManually',parameters
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

    UpdateBOLHDR(parameters:ShipmentByLading){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.post<Object>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/UpdateBOLHDR',parameters
        ,{
            headers: httpHeaders
        }
        ).toPromise();
    }

    GetStatusReasonCode(keyId:string){
        const ticket = this.token;
        const httpHeaders = new HttpHeaders({
            Ticket : ticket
        });
        return this.http.get<StatusReason[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetStatusReasonCode?_={1}',keyId)
        ,{
            headers: httpHeaders
          }
          ).toPromise();
    }

}
