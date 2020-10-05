import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Rate } from './Entities/rate';
//import { Observable } from 'rxjs/Observable';
 
@Injectable({
  providedIn: 'root'
})
export class RatesService {
  url = "https://beta-customer.r2logistics.com/Services/RatingEngineService.svc/json/RateShipment";
  constructor(private http: HttpClient) { }
  
  // postRates(objRate: Object): Observable<HttpResponse<Object>> {
  //   let httpHeaders = new HttpHeaders({
  //        'Content-Type' : 'application/json'
  //   });    
  //   return this.http.post<Object>(this.url, objRate,
  //       {
  //         headers: httpHeaders,
  //         observe: 'response'
  //       }
  //   );
  // }    

  postRates(objRate: Object)
  {
    let httpHeaders = new HttpHeaders({
               'Ticket' : '28C144FA064090885C764FCB47F56ADC4658ADCE6C59DF238F7C4390ACB367D861B9AD9CF860EA2D3FAC4D26A4E8E92C00676429C756AFD8CD84B034D1217E588DEECF639ED681E21B83B95B516FA477AF03351FA395A2DFDA95D276EB3841CFABDA9BE429757ED63AE8CABAE7BA1C9BA181DC33434DB05D067C0467B8F5C5A361877AF549410DAE56EF9960755C20D03018A1223834E08829A55469EDA30131'                            
    });    

    return this.http.post<Rate[]>(this.url, objRate,{
      headers: httpHeaders
    }).toPromise();
  }

  // async postRates(objRate: Object): Observable<HttpResponse<Object>> {
  //     let httpHeaders = new HttpHeaders({
  //          'Content-Type' : 'application/json'
  //          ,
  //          'Access-Control-Allow-Origin' : '*'
  //         //  ,
  //         //   'Access-Control-Allow-Methods' : 'POST',
  //         //   'Access-Control-Allow-Headers' : 'Content-Type',
  //         //   'Access-Control-Allow-Credentials': 'true'
  //     });    
  //     return await this.http.post<any>(this.url,objRate,
  //         {
  //           headers: httpHeaders,
  //           observe: 'response'
  //         }
  //     ).toPromise();
  //   }        

}
