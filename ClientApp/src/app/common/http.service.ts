import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
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
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ReferenceByClient } from '../Entities/ReferenceByClient';
import { MasUser } from '../Entities/mas-user.model';
import { SendEmailParameters } from '../Entities/SendEmailParameters';
import { SendEmailResponse } from '../Entities/SendEmailResponse';
import { SaveQuoteData } from '../Entities/SaveQuoteData';
import { StatusReason } from '../Entities/StatusReason';
import { GetLocationsParameters } from "../Entities/GetLocationsParameters";
import { Location } from "../Entities/Location";
import { TrackingDetails } from '../Entities/TrackingDetails';
import { Country } from "../Entities/Country";
import { Rate } from '../Entities/rate';
import { LocationGroup } from "../Entities/LocationGroup";
import { HtmlMsgByClient } from '../Entities/HtmlMsgByClient';
import { Client } from '../Entities/client.model';
import { PCFClientDefaults } from '../Entities/PCFClientDefaults';
import { ProductGroup } from "../Entities/ProductGroup";
import { Product } from "../Entities/Product";
import { TotalStatusRecords } from '../Entities/TotalStatusRecords';
import { weightcostCompareModel } from '../Entities/WeightCostCompareModel';
import { AccessorialPerformance } from '../Entities/AccessorialPerformance';
import { CarrierPerformanceModel } from '../Entities/CarrierPerformanceModel';
import { TopLanes } from '../Entities/TopLanes';
import { ProductByClient } from  '../Entities/ProductByClient';
import { DashBoardMissedPickupModel } from '../Entities/DashBoardMissedPickupModel';

@Injectable({
    providedIn: 'root'
})

export class HttpService {

    public token = '';
    private baseEndpoint: string;
    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.init();
        this.token = this.authenticationService.ticket$.value;
        this.baseEndpoint = environment.baseEndpoint;
    }

    getCountryList(keyId: string) {
        return this.http.get<PostalData[] | Country>(
            String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetCountryList?_={0}', keyId)            
        ).toPromise();
    }

    getMasUserStatus() {
        return this.http.get(
            this.baseEndpoint + 'Services/MASUserService.svc/json/GetMasUserStatus'
        ).toPromise();
    }

    // Locations Methods
    getMasLocations(parameters: GetLocationsParameters) {
        return this.http.post<Location[]>(this.baseEndpoint + 'Services/MasLocationService.svc/json/GetMasLocation', parameters
        ).toPromise();
    }

    UpdateMasLocation(parameters: Location) {
        return this.http.post<Location[]>(this.baseEndpoint + 'Services/MasLocationService.svc/json/UpdateMasLocation', parameters
        ).toPromise();
    }

    InsertMasLocation(parameters: Location) {
        return this.http.post<Location[]>(this.baseEndpoint + 'Services/MasLocationService.svc/json/InsertMasLocation', parameters
        ).toPromise();
    }

    GetMasLocationType() {
        return this.http.get(
            this.baseEndpoint + 'Services/MasLocationService.svc/json/GetMasLocationType'
        ).toPromise();
    }

    GetLocationGroupByClient(clientId): Promise<LocationGroup[]> {
        return this.http.get<LocationGroup[]>(
            `${this.baseEndpoint}Services/MasLocationService.svc/json/GetLocationGroupByClient?ClientID=${clientId}`
        ).toPromise();
    }

    DeleteMasLocationType(locationId) {
        return this.http.get(
            this.baseEndpoint + `Services/MasLocationService.svc/json/DeleteMasLocation?LocationID=${locationId}`
        ).toPromise();
    }

    // Product methods
    GetProductGroupType(clientId): Promise<ProductGroup[]> {
        return this.http.get<ProductGroup[]>(
            `${this.baseEndpoint}Services/MasProductService.svc/json/GetProductGroupType?ClientID=${clientId}&_=1608171142226`
        ).toPromise();
    }

    GetAndSearchPagedProductDetailsCount(parameters): Promise<any> {
        return this.http.post<any>(
            `${this.baseEndpoint}Services/MasProductService.svc/json/GetAndSearchPagedProductDetailsCount`, parameters
        ).toPromise();
    }

    GetAndSearchPagedProductDetails(parameters): Promise<any> {
        return this.http.post<any>(`${this.baseEndpoint}Services/MasProductService.svc/json/GetAndSearchPagedProductDetails`, parameters
        ).toPromise();
    }

    UpdateProductDetails(parameters): Promise<any> {
        return this.http.post<any>(`${this.baseEndpoint}Services/MasProductService.svc/json/UpdateProductDetails`, parameters
        ).toPromise();
    }

    InsertProductDetails(parameters): Promise<any> {
        return this.http.post<any>(`${this.baseEndpoint}Services/MasProductService.svc/json/InsertProductDetails`, parameters
        ).toPromise();
    }

    DeleteProductDetails(productId, key = null): Promise<ProductGroup[]> {
        return this.http.get<ProductGroup[]>(
            `${this.baseEndpoint}Services/MasProductService.svc/json/DeleteProductDetails?ProductID=${productId}&_=${key}`
        ).toPromise();
    }

    async getMainToken(): Promise<string> {

        return new Promise((resolve, reject) => {

            let headers;
            let Ticket;
            this.http
                .get<Object>(this.baseEndpoint + 'Services/LoginService.svc/Json/DoLogin?Username=superadmin&Password=3500oaklawn&userType=C', { observe: 'response' })
                .subscribe(resp => {
                    Ticket = resp.headers.get('ticket');
                    const keys = resp.headers.keys();
                    // headers = keys.map(key =>
                    //   `${key}: ${resp.headers.get(key)}`);

                    resolve(Ticket);
                });


        })
    }

    // getStateDataByCountryId(countryId: string, keyId: string) {
    //     countryId = countryId !== '' ? countryId : '1';
    //     return this.http.get(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}', countryId)
    //     ).toPromise();
    // }

    getStateDataByCountryId(countryId: string, keyId: string) {
        countryId = countryId !== '' ? countryId : '1';
        return this.http.get<PostalData[]>(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId={0}', countryId)
        ).toPromise();
    }

    getPostalDataByPostalCode(postalCode: string, countryId: string, keyId: string) {
        return this.http.get<PostalData[]>(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}', postalCode, countryId, keyId)
        ).toPromise();
    }

    getProductPackageType(keyId: string) {
        return this.http.get<ProductPackageType[]>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetMasProductPackageType?_={0}', keyId)
        ).toPromise();
    }

    getUserMessage(keyId: string) {
        return 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.';
    }

    getClientDefaultsByClient(clientID: number, keyId: string) {
        return this.http.get<ClientDefaultData>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetClientDefaultsByClient?ClientID={0}&_={1}', clientID.toString(), keyId)
        ).toPromise();
    }

    getClientsByClientName(userID: number, clientName: string) {
        return this.http.get<Client[]>(this.baseEndpoint + `Services/MASClientService.svc/json/GetClientForUser?userID=${userID}&ClientName=${clientName}`
        ).toPromise();
    }

    searchBOLHDRForJason(parameters: GetQuotesParameters) {
        return this.http.post<Quote[]>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/SearchBOLHDRForJason', parameters
        ).toPromise();
    }

    updateMasUser(masUser: MasUser) {
        return this.http.post<any>(this.baseEndpoint + 'Services/MASUserService.svc/json/UpdateMasUser', masUser
        ).toPromise();
    }

    getUserFromStorage() {
        return this.authenticationService.getUserFromStorage();
    }

    getMasEquipment(keyId: string) {
        return this.http.get<EquipmentType[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetMasEquipment?_={0}', keyId)
        ).toPromise();
    }

    getShipmentMode(keyId: string) {
        return this.http.get<ShipmentMode[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentMode?_={0}', keyId)
        ).toPromise();
    }

    getBOLStatus(keyId: string) {
        return this.http.get<Status[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetBOLStatus?_={0}', keyId)
        ).toPromise();
    }

    postalCodeAutocomplete(postalCode: string, countryId: string, keyId: string) {
        let opts = [];
        return (postalCode.length < 5) ?
            of(opts) :
            this.http.get<PostalData[]>(String.Format(this.baseEndpoint + 'Services/MASCityStatePostalService.svc/json/GetPostalDataByPostalCode?MASPostalCode={0}&countryID={1}&_={2}', postalCode, countryId, keyId)
            ).pipe(tap(data => opts = data))
    }

    getGetClientMappedAccessorials(clientID: number, keyId: string) {
        return this.http.get<AccessorialDetail[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json//GetClientMappedAccesorial?ClientID={0}&IsIncludeSystem=false&_={1}', clientID.toString(), keyId)
        ).toPromise();
    }

    GetShipmentCostByLadingID(LadingID: string, keyId: string) {
        return this.http.get<ShipmentCost>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentCostByLadingID?LadingID={0}&_={1}', LadingID.toString(), keyId)
        ).toPromise();
    }

    saveQuote(parameters: SaveQuoteParameters) {
        return this.http.post<SaveQuoteResponse>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/SaveQuote', parameters
        ).toPromise();
    }

    saveNewQuote(parameters: SaveQuoteData) {
        return this.http.post<SaveQuoteResponse>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/SaveQuote', parameters
        ).toPromise();
    }

    getMasShipmentPriority() {
        return this.http.get<ShipmentPriority[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetMasShipmentPriority')
        ).toPromise();
    }

    getMasServiceLevel(clientID: number, keyId: string) {
        return this.http.get<ServiceLevelDetail[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetMasServiceLevel?ClientID={0}&_={1}', clientID.toString(), keyId)
        ).toPromise();
    }

    getMasPaymentTerms() {
        return this.http.get<PaymentTerm[]>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetMasPaymentTerms')
        ).toPromise();
    }

    getShipmentError(keyId: string) {
        return this.http.get<ShipmentError[]>(
            String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/getShipmentError?_={0}', keyId)
        ).toPromise();
    }

    getCarrierData(clientID: number, carrier: string, keyId: string) {
        return this.http.get<Carrier[]>(String.Format(this.baseEndpoint + 'Services/CarrierService.svc/json/GetMasCarrierByCarrierCodeOrName?clientID={0}&CarrierCodeorName={1}&_={2}', clientID.toString(), carrier, keyId)
        ).toPromise();
    }

    carrierAutocomplete(clientID: number, carrier: string, keyId: string) {
        let opts = [];
        return (carrier.length < 4) ?
            of(opts) :
            this.http.get<Carrier[]>(String.Format(this.baseEndpoint + 'Services/CarrierService.svc/json/GetMasCarrierByCarrierCodeOrName?clientID={0}&CarrierCodeorName={1}&_={2}', clientID.toString(), carrier, keyId)
            ).pipe(tap(data => opts = data))
    }

    GetShipmentByLadingID(LadingID: string, keyId: string) {
        return this.http.get<ShipmentByLading>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentByLadingID?LadingID={0}&_={1}', LadingID, keyId)
        ).toPromise();
    }

    getTrackingDetailsByLadingID(landingId: string, keyId: string) {
        return this.http.get<TrackingDetails[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetTrackingDetailsByLadingID?LadingID={0}&_={1}', landingId, keyId)
        ).toPromise();
    }

    GetReferenceByClient(clientID: number, keyId: string) {
        return this.http.get<ReferenceByClient[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json//GetReferenceByClient?ClientID={0}&_={1}', clientID.toString(), keyId)
        ).toPromise();
    }

    SendBolConfirmation(parameters: SendEmailParameters) {
        return this.http.post<SendEmailResponse>(this.baseEndpoint + 'Services/SendEmailService.svc/json/SendBolConfirmation', parameters
        ).toPromise();
    }

    SendMailLabelManually(parameters: SendEmailParameters) {
        return this.http.post<SendEmailResponse>(this.baseEndpoint + 'Services/SendEmailService.svc/json/SendMailLabelManually', parameters
        ).toPromise();
    }

    SendEmailManually(parameters: SendEmailParameters) {
        return this.http.post<SendEmailResponse>(this.baseEndpoint + 'Services/SendEmailService.svc/json/SendEmailManually', parameters
        ).toPromise();
    }

    UpdateBOLHDR(parameters: ShipmentByLading) {
        return this.http.post<Object>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/UpdateBOLHDR', parameters
        ).toPromise();
    }

    GetStatusReasonCode(keyId: string) {
        return this.http.get<StatusReason[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetStatusReasonCode?_={0}', keyId)
        ).toPromise();
    }

    CalculateExpectedDeliveryDate(keyId: string, transitdays: string, pickupdate: string) {
        return this.http.get<string>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json//CalculateExpectedDeliveryDate?transitdays={0}&pickupdate={1}&_={2}', transitdays, pickupdate, keyId)
        ).toPromise();
    }

    OpenShipment(parameters: SaveQuoteData) {
        return this.http.post<SaveQuoteResponse>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/OpenShipment', parameters
        ).toPromise();
    }

    postRates(objRate: Object) {
        return this.http.post<Rate[]>(this.baseEndpoint + 'Services/RatingEngineService.svc/json/RateShipment', objRate
        ).toPromise();
    }

    ModifiedQuote(parameters: SaveQuoteData) {
        return this.http.post<Object>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/ModifiedQuote', parameters
        ).toPromise();
    }

    ModifiedQuoteWithLadingData(parameters: ShipmentByLading) {
        return this.http.post<Object>(this.baseEndpoint + 'Services/BOLHDRService.svc/json/ModifiedQuote', parameters
        ).toPromise();
    }

    GetPCFClientDefaultsByClient(ClientID: string) {
        return this.http.get<PCFClientDefaults>(String.Format(this.baseEndpoint + 'Services/MasClientDefaultsService.svc/json/GetPCFClientDefaultsByClient?ClientID={0}', ClientID)
        ).toPromise();
    }

    GetTotalRowsPerStatus(clientId: number, statusId: number) {
        return this.http.get<TotalStatusRecords>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetCountByClientAndStatus?ClientId={0}&StatusId={1}', clientId, statusId)
        ).toPromise();
    }

    GetLocationByType(clientId: number, locationTypeId: number, locationName: string, keyId:string) {
        let opts = [];
        return (locationName.length < 3) ?
            of(opts) :
            this.http.get<Location[]>(String.Format(this.baseEndpoint + 'Services/MasLocationService.svc/json/GetLocationByType?ClientID={0}&LocationTypeID={1}&LocationName={2}&_={3}',clientId, locationTypeId, locationName, keyId)
            ).pipe(tap(data => opts = data))
    }

    GetProductByClient(clientId: number, keyId:string) {
        return this.http.get<ProductByClient[]>(String.Format(this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetProductByClient?ClientID={0}&_={1}',clientId, keyId)
            ).toPromise();
    }

    /* Start http Services for Reports */
    GetShipmentModeForReport() {
        return this.http.get<ShipmentMode[]>(
            this.baseEndpoint + 'Services/BOLHDRService.svc/json/GetShipmentMode'
        ).toPromise();
    }

    public GetClientsForReportByUserAndClientName(userID: number, val: string) {
        return this.http.get<Client[]>(
            this.baseEndpoint + 'Services/MASClientService.svc/json/GetClientForUser?userID=' + userID + '&ClientName=' + val
        ).toPromise();
    }
    /* END */

    /* Start http Services for Dash board */
    public DashBoard_GetTotalShipmentByMTDByDate(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<weightcostCompareModel[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTotalShipmentByMTDByDate?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopAccesorial(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<AccessorialPerformance[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetAllAccesorialsByClientAndShipDate?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
            // 'http://localhost:63784/Services/DashBoardService.svc/json/DashBoard_GetAllAccesorialsByClientAndShipDate?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopCarriers(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<CarrierPerformanceModel[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTopCarriers?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&ByVolume=true&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopCarriersByShipmentValue(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<CarrierPerformanceModel[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTopCarriers?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&ByVolume=false&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopLaneForZip(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<TopLanes[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTopLaneForZip?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&TopValue=10&OrderBy=1&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopLaneForZipCity(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<TopLanes[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTopLaneForZipCity?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&TopValue=10&OrderBy=1&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopLaneForState(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<TopLanes[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTopLaneForState?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&TopValue=10&OrderBy=1&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetTopVendorForPPS(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<weightcostCompareModel[]>(            
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetTopVendorForPPSByDate?clientId=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient         
            // 'http://localhost:63784/Services/DashBoardService.svc/json/DashBoard_GetTopVendorForPPSByDate?clientId=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetCarrierPerformanceByDate(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<CarrierPerformanceModel[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetCarrierPerformanceByDate?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
            // 'http://localhost:63784/Services/DashBoardService.svc/json/DashBoard_GetCarrierPerformanceByDate?clientID=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetMissedPickup(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<DashBoardMissedPickupModel[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetMissedPickup?clientId=' + clientID + '&pickupDateFrom=' + dateFrom + '&pickupDateTo=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
            // 'http://localhost:63784/Services/DashBoardService.svc/json/DashBoard_GetMissedPickup?clientId=' + clientID + '&pickupDateFrom=' + dateFrom + '&pickupDateTo=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }

    public DashBoard_GetCarrierPerformance(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        return this.http.get<CarrierPerformanceModel[]>(
            this.baseEndpoint + 'Services/DashBoardService.svc/json/DashBoard_GetCarrierPerformanceByDate?clientid=' + clientID + '&shipFromdate=' + dateFrom + '&shipTodate=' + dateTo + '&IsIncludeSubClient=' + isIncludeSubClient
            // 'http://localhost:63784/Services/DashBoardService.svc/json/DashBoard_GetCarrierPerformanceByDate?clientid=' + clientID + '&IsIncludeSubClient=' + isIncludeSubClient
        ).toPromise();
    }
    /* END */

    /* Start 18/06/2021 */
    public GetPromotionVideoByClientID(clientId: number, keyId:string) {
        return this.http.get<String>(String.Format(this.baseEndpoint + 'Services/MasBrandsService.svc/json/GetPromotionVideoByClientID?ClientID={0}&_={1}',clientId, keyId)
            ).toPromise();
    }
    /* End 18/06/2021 */
}
