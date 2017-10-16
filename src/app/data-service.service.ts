import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  domain = 'http://abhayjain.in/nkd/reportindex.php';

  getAllStores(): Observable<any>{
    return this.http.get( this.domain + '/AllStores')
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getNetSales(type, id): Observable<any>{
    var url = this.domain + '/NetSales/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getGrossSales(type, id): Observable<any>{
    var url = this.domain + '/GrossSales/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getCustomers(type, id): Observable<any>{
    var url = this.domain + '/Customers/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getLaborCost(type, id): Observable<any>{
    var url = this.domain + '/LabourCost/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getDeliveryCharges(type, id): Observable<any>{
    var url = this.domain + '/DeliveryCharges/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getVoids(type, id): Observable<any>{
    var url = this.domain + '/Voids/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getPayments(type, id): Observable<any>{
    var url = this.domain + '/Payments/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getSalesCategory(type, id): Observable<any>{
    var url = this.domain + '/SalesCategory/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getDiscounts(type, id): Observable<any>{
    var url = this.domain + '/Discount/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getTaxes(type, id): Observable<any>{
    var url = this.domain + '/Tax/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getOrderTypes(type, id): Observable<any>{
    var url = this.domain + '/OrderType/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getTopEmployee(type, id): Observable<any>{
    var url = this.domain + '/TopEmployee/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getOutTheDoorData(type, id): Observable<any>{
    var url = this.domain + '/OTD/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getTopDeliveryArea(type, id): Observable<any>{
    var url = this.domain + '/TopCity/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getSpeedlineConnectData(type, id): Observable<any>{
    var url = this.domain + '/SLC/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }


   getNetSalesMainData(type, id, subType): Observable<any>{
    var url = this.domain + '/NetSales/'+type+'/'+id+'/'+subType;

    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getTopCoupon(type, id): Observable<any>{
    var url = this.domain + '/TopCoupon/'+type;
    if(id != ''){
      url = url + '/' + id;
    }
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }


  getGlobalDashboard(): Observable<any>{
    var url = 'http://35.185.240.172/nkd/reportindex.php/Dashboard';
    
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getCountryDashboard(id): Observable<any>{
    var url = 'http://35.185.240.172/nkd/index.php/Dashboard/Country/'+id;
    
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getStoreDashboard(id): Observable<any>{
    var url = 'http://35.185.240.172/nkd/index.php/Dashboard/Store/'+id;
    
    return this.http.get(url)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }



  mainColor = '#5f7234';
  lastColor = '#5f7234';

  assignColors(data, isColorParam, paramName) {
    
    for(var i=0; i<data.length; i++) {

      if(isColorParam) {
        data[i][paramName] = this.shadeColor2(this.lastColor, 0.2);
        this.lastColor = data[i][paramName];
      }else{
        data[i] = this.shadeColor2(this.lastColor, 0.2);
        this.lastColor = data[i];
      }  
           
    }
    
    this.lastColor = '#5f7234';
    return data;
  }

  shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }


  countryId = '';
  setCountryId(ctId) {
    this.countryId = ctId;
  } 

  getCountryId() {
    return (this.countryId);
  } 


}
