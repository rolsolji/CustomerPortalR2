import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/common/http.service';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class DashBoardService {

    constructor(private httpService: HttpService, public datepipe: DatePipe) {
    }

    public async DashBoard_GetTotalShipmentByMTDByDate(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTotalShipmentByMTDByDate(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopAccesorial(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopAccesorial(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopCarriers(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopCarriers(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopCarriersByShipmentValue(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopCarriersByShipmentValue(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopLaneForZip(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopLaneForZip(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopLaneForZipCity(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopLaneForZipCity(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopLaneForState(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopLaneForState(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetTopVendorForPPS(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetTopVendorForPPS(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetCarrierPerformanceByDate(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetCarrierPerformanceByDate(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetMissedPickup(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetMissedPickup(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }

    public async DashBoard_GetCarrierPerformance(clientID: number, dateFrom: string, dateTo: string, isIncludeSubClient: boolean) {
        const data = await this.httpService.DashBoard_GetCarrierPerformance(clientID, dateFrom, dateTo, isIncludeSubClient);
        return data;
    }
}