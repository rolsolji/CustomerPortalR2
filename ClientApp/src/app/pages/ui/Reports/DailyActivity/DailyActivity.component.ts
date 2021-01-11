import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'vex-DailyActivity-report',
    templateUrl: './DailyActivity.component.html',
    styleUrls: ['./DailyActivity.component.scss']
})

export class DailyActivityComponent implements OnInit {    

    public reportName: string = '';
    public isShowReportOption: boolean;    
    public isShowMode: boolean;
    public isShowPickupDate: boolean;
    public isShowInvoiceDate: boolean;
    public isShowIncludeSubClient: boolean;    

    constructor(){
    }    

    ngOnInit():void{
        this.reportName = "Daily Activity";
        this.isShowReportOption = true;        
        this.isShowMode = true;
        this.isShowPickupDate = true;
        this.isShowInvoiceDate = true;
        this.isShowIncludeSubClient = true;        
    }
}