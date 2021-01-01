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
}