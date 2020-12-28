import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'vex-kpi-report',
    templateUrl: './KPI.component.html',
    styleUrls: ['./KPI.component.scss']
})

export class KeyPerformanceIndicatorComponent implements OnInit {    

    public reportName: string = '';
    public isShowClientName: boolean;

    public isShowMode: boolean;
    public isShowPickupDate: boolean;
    public isShowOnlyInvoiced: boolean;
    public isShowAVGCostPerMile: boolean;

    constructor(){
    }    

    ngOnInit():void{
        this.reportName = "Key Performance Indicator";
        this.isShowClientName = true;
        this.isShowMode = true;
        this.isShowPickupDate = true;
        this.isShowOnlyInvoiced = true;
        this.isShowAVGCostPerMile = true;
    }
}