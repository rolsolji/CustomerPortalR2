import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {

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
}