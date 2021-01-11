import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/common/http.service';
import { DatePipe } from '@angular/common';
import { Client } from 'src/app/Entities/client.model';
import { ShipmentMode } from 'src/app/Entities/ShipmentMode';

@Injectable({
    providedIn: 'root'
})

export class ReportService {    
    
    constructor (private httpService: HttpService, public datepipe: DatePipe){
    }

    public async GetClientsForReportByUserAndClientName(userID:number, val:string) {
        const clients = await this.httpService.GetClientsForReportByUserAndClientName(userID,val);
        return clients;
    }

}