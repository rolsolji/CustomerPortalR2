import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'vex-ShipmentHistory-report',
    templateUrl: './ShipmentHistory.component.html',
    styleUrls: ['./ShipmentHistory.component.scss']
})

export class ShipmentHistoryComponent implements OnInit {    

    public reportName: string = '';
    public isShowReportOption: boolean;
    public isShowPickupDate: boolean;    
    public isShowMode: boolean;
    public isShipmentOrQuote: boolean;
    public isShowIncludeSubClient: boolean;

    constructor(){
    }    

    ngOnInit():void{
        this.reportName = "Shipment History";
        this.isShowReportOption = true;
        this.isShipmentOrQuote = true;        
        this.isShowMode = true;
        this.isShowPickupDate = true;     
        this.isShowIncludeSubClient = true;   
    }
}