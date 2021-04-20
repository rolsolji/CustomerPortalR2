import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {

    TruckWidthGlobal : number = 102;
    TruckHeightGlobal : number = 150;

    AddBusinessDays(currentDate: Date, days: number) : Date{
        for (var i = 0; i < days; i++)
        {
            do
            {
                currentDate.setDate(currentDate.getDate() + 1);
            }
            while (currentDate.getDay() == 0 ||
                currentDate.getDay() == 6);
        }
        return currentDate;
    }

    ConvertDateToJsonFormate (txtDate: Date){
        var time = txtDate.getTime();
        var timezone = txtDate.getTimezoneOffset();
        var totaltime = parseInt(timezone.toString()) * 60000 * (-1) + parseInt(time.toString());
        var Jsondate = "\/Date(" + totaltime.toString() + ")\/";    
        return Jsondate;
    }

    ConverteJsonDateToLocalTimeZone(JsonDate: string) {
        let d = new Date();
        let ShipDate;
        let offset = d.getTimezoneOffset();
    
        let JsonDateDate;
        if (JsonDate.toString().indexOf('Date(') === -1) {
            JsonDateDate = new Date(JsonDate);
            JsonDateDate = JsonDateDate.getTime();
    
            JsonDateDate = parseInt(offset.toString()) * 60000 * (-1) + parseInt(JsonDate);
    
            JsonDateDate = '\/Date(' + JsonDate.toString() + ')\/';
        }
    
        if (JsonDate.toString().indexOf('-') !== -1) {
    
            let timeoffsetfromservicedate = JsonDate.toString().substring(JsonDate.toString().indexOf('-') + 1, JsonDate.toString().indexOf(')/'));
    
            let leftOffSetHour = parseInt(timeoffsetfromservicedate.toString().substring(0, 2)) * 60;
            let offsethour = parseInt(leftOffSetHour.toString()) + parseInt(timeoffsetfromservicedate.toString().substring(2, 4));
    
            let totalmillsecond = parseInt(offset.toString()) * 60000 + parseInt(parseInt(JsonDate.toString().substring(6)).toString()) - parseInt(offsethour.toString()) * 60000;
    
            ShipDate = new Date(totalmillsecond);
        }
        else {
            let totalmillsecond;
            if (JsonDate.toString().indexOf('+') > 0) {
    
                let timeoffsetfromservicedate = JsonDate.toString().substring(JsonDate.toString().indexOf('+') + 1, JsonDate.toString().indexOf(')/'));
    
                let leftoffsethour = parseInt(timeoffsetfromservicedate.toString().substring(0, 2)) * 60;
                let offsethour = parseInt(leftoffsethour.toString()) + parseInt(timeoffsetfromservicedate.toString().substring(2, 4));
    
                totalmillsecond = parseInt(offset.toString()) * 60000 + parseInt(parseInt(JsonDate.toString().substring(6)).toString()) + parseInt(offsethour.toString()) * 60000;
    
                ShipDate = new Date(totalmillsecond);
            }
            else {
                totalmillsecond = parseInt(parseInt(JsonDate.toString().substring(6)).toString());
    
    
                let utcMonth = new Date(totalmillsecond).getUTCMonth() + 1;
                let utcDay = new Date(totalmillsecond).getUTCDate();
                let utcYear = new Date(totalmillsecond).getUTCFullYear()
    
                let formatedUtcShipDate = utcMonth + '/' + utcDay + '/' + utcYear;
    
                ShipDate = new Date(formatedUtcShipDate);
            }
    
        }

        let getMonth = ShipDate.getMonth() + 1;
        let getDay = ShipDate.getDate();
        let getYear = ShipDate.getFullYear()

        let formatedShipDate = getMonth + '/' + getDay + '/' + getYear;
        return formatedShipDate;
    }

    /* Start 19/04/2021 */

    CalculateLinearfeet(linearFeetType: string, isStackable: boolean, pallets: any, productLength: any, productWidth : any, productHeight: any) {
        var linearfeetValue = 0;
        var tempLinearFeetValue = "0";
        if (linearFeetType == "Turned") {
            tempLinearFeetValue = this.CalculateLinearfeetTurned(isStackable, pallets, productLength, productWidth, productHeight);
        }
        else if (linearFeetType == "PinWheeled") {
            tempLinearFeetValue = this.CalculateLinearfeetPinWheeled(isStackable, pallets, productLength, productWidth, productHeight);
        }
        else if (linearFeetType == "Straight") {
            tempLinearFeetValue = this.CalculateLinearfeetStraight(isStackable, pallets, productLength, productWidth, productHeight);
        }
        else {
            tempLinearFeetValue = this.CalculateLinearfeetStraight(isStackable, pallets, productLength, productWidth, productHeight);
        }
    
        linearfeetValue = Number(tempLinearFeetValue);
    
        return linearfeetValue.toFixed(2);
    }

    CalculateLinearfeetStraight(isStackable: boolean, pallets: any, productLength: any, productWidth : any, productHeight: any) {
        var linearfeetValue = 0;
        var truckWidth = this.TruckWidthGlobal;
        var truckHeight = this.TruckHeightGlobal;
    
        if (pallets != null && pallets != undefined && pallets != "" && pallets != 0 &&
            productLength != null && productLength != undefined && productLength != "" && productLength != 0 &&
            productWidth != null && productWidth != undefined && productWidth != "" && productWidth != 0 &&
            productHeight != null && productHeight != undefined && productHeight != "" && productHeight != 0 &&
            truckWidth != null && truckWidth != undefined && truckWidth != 0 &&
            truckHeight != null && truckHeight != undefined && truckHeight != 0
        ) {
            pallets = Number(pallets);
            productLength = Number(productLength);
            productWidth = Number(productWidth);
            productHeight = Number(productHeight);
            truckWidth = Number(truckWidth);
            truckHeight = Number(truckHeight);
    
            var NH = 1;
            var NW = 0;
            if (isStackable == true) {
                NH = truckHeight / productHeight;
                NH = Math.floor(NH);
            }
    
            NW = truckWidth / productWidth;
            NW = Math.floor(NW);
    
            if ((NH * NW) > 0) {
                linearfeetValue = Math.ceil((pallets / (NH * NW)));
                linearfeetValue = linearfeetValue * (productLength / 12)
            }
        }
    
        return linearfeetValue.toFixed(2);
    }

    CalculateLinearfeetTurned(isStackable: boolean, pallets: any, productLength: any, productWidth : any, productHeight: any) {
        var linearfeetValue = 0;
        var truckWidth = this.TruckWidthGlobal;
        var truckHeight = this.TruckHeightGlobal;
    
        if (pallets != null && pallets != undefined && pallets != "" && pallets != 0 &&
            productLength != null && productLength != undefined && productLength != "" && productLength != 0 &&
            productWidth != null && productWidth != undefined && productWidth != "" && productWidth != 0 &&
            productHeight != null && productHeight != undefined && productHeight != "" && productHeight != 0 &&
            truckWidth != null && truckWidth != undefined && truckWidth != 0 &&
            truckHeight != null && truckHeight != undefined && truckHeight != 0
        ) {
            pallets = Number(pallets);
            productLength = Number(productLength);
            productWidth = Number(productWidth);
            productHeight = Number(productHeight);
            truckWidth = Number(truckWidth);
            truckHeight = Number(truckHeight);
    
            var NH = 1;
            var NW = 0;
            if (isStackable == true) {
                NH = truckHeight / productHeight;
                NH = Math.floor(NH);
            }
    
            NW = truckWidth / productLength;
            NW = Math.floor(NW);
    
            if ((NH * NW) > 0) {
                linearfeetValue = Math.ceil((pallets / (NH * NW)));
                linearfeetValue = linearfeetValue * (productWidth / 12)
            }
        }
    
        return linearfeetValue.toFixed(2);
    }

    CalculateLinearfeetPinWheeled(isStackable: boolean, pallets: any, productLength: any, productWidth : any, productHeight: any) {
        var linearfeetValue = 0;
        var truckWidth = this.TruckWidthGlobal;
        var truckHeight = this.TruckHeightGlobal;
    
        if (pallets != null && pallets != undefined && pallets != "" && pallets != 0 &&
            productLength != null && productLength != undefined && productLength != "" && productLength != 0 &&
            productWidth != null && productWidth != undefined && productWidth != "" && productWidth != 0 &&
            productHeight != null && productHeight != undefined && productHeight != "" && productHeight != 0 &&
            truckWidth != null && truckWidth != undefined && truckWidth != 0 &&
            truckHeight != null && truckHeight != undefined && truckHeight != 0
        ) {
            pallets = Number(pallets);
            productLength = Number(productLength);
            productWidth = Number(productWidth);
            productHeight = Number(productHeight);
            truckWidth = Number(truckWidth);
            truckHeight = Number(truckHeight);
    
            var NH = 1;
            var NW = 0;
            var BL = 0;
            var SL = 0;
            var NP = 0;
    
            if (isStackable == true) {
                NH = truckHeight / productHeight;
                NH = Math.floor(NH);
            }
    
            NW = truckWidth / (productLength + productWidth);
            NW = Math.floor(NW);
            NW = NW * 2;
    
            if (productLength > productWidth) {
                BL = productLength;
                SL = productWidth;
            }
            else {
                BL = productWidth;
                SL = productLength;
            }
    
            if ((NH * NW) > 0) {
                NP = pallets / (NH * NW);
                NP = Math.ceil(NP);
            }
    
            if (NP % 2 == 0) {
                linearfeetValue = NP * ((BL + SL) / 24);
            }
            else {
                NP = NP / 2;
                NP = Math.floor(NP);
    
                var tmpvalue1 = NP * (SL / 12);
                var tmpvalue2 = (NP + 1) * (BL / 12);
    
                linearfeetValue = (tmpvalue1) + (tmpvalue2);
            }
        }
    
        return linearfeetValue.toFixed(2);
    }

    /* End */
}