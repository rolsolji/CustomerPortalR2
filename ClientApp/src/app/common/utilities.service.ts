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
}