import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'vex-CarrierPerformance-report',
    templateUrl: './CarrierPerformance.component.html',
    styleUrls: ['./CarrierPerformance.component.scss']
})

export class CarrierPerformanceComponent implements OnInit {    

    public reportName: string = '';
    public isShowReportOption: boolean;
    public isShowClientName: boolean;
    public isShowMode: boolean;
    public isShowPickupDate: boolean;
    public isShowIncludeSubClient: boolean;    

    constructor(){
    }    

    ngOnInit():void{
        this.reportName = "Carrier Performance";
        this.isShowReportOption = true;
        this.isShowClientName = true;
        this.isShowMode = true;
        this.isShowPickupDate = true;
        this.isShowIncludeSubClient = true;        
    }
}