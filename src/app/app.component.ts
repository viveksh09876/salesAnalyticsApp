import { Component,OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data-service.service';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized} from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
   storeId: number;
   private sub: any;

  constructor(private dataService: DataService, private router: Router, private route:ActivatedRoute) { 
     
  }

  netSalesGlobal: number;
  grossSalesGlobal: number;
  showSideBar = false;
  pageType: string = '';
  typeId: string = '';
  pageTitle: string = '';
  countryId: string = '';

  ngOnInit() {
     
    this.router.events.subscribe((val) => {
        if(val instanceof RoutesRecognized){
            if(val.url != '/' && val.url != '/login'){

              this.showSideBar = true;
               
              if(val.url != '/dashboard') {
                  let urlArr = val.url.split('/');
                  
                  if(urlArr.length > 2) {
                    this.pageType = urlArr[1];
                    this.pageType = this.pageType[0].toUpperCase() + this.pageType.slice(1);
                    
                    this.typeId = urlArr[2];
                    //this.getNetSalesData(this.pageType, this.typeId); 
                    //this.getGrossSalesData(this.pageType, this.typeId);
                    
                    if(this.pageType == 'Country') {
                      this.pageTitle = decodeURI(this.typeId);
                    }
                    
                    if(this.pageType == 'Store') {
                     
                      //this.getAllStoresData(decodeURI(this.typeId));
                    }
                    
                  }
                
              }else{
                  this.pageType = 'Global'
                  //this.getNetSalesData('Global', ''); 
                  //this.getGrossSalesData('Global', '');
                  this.pageTitle = 'Global';
              }
              

            }else{
              this.showSideBar = false;
            }

            
        } 

    });


  }

  

toggleDeskTopLoginBar(event){
   $('.login_details .user-dropdown').slideToggle();
}

 toggleLoginBar(event){
    $('.login-toggle').toggleClass('cross');
    $('body').toggleClass('noshow');
    $('.user-mobile-dropdown').toggleClass('show');
    $('.overlay').toggleClass('showlay');
    $('.navbar-toggle').toggleClass('fade');
 } 

 toggleNavBar(event){
    $('.login-toggle').toggleClass('cross');
    $('body').toggleClass('noshow');
    $('#Main_menu').toggleClass('show');
    $('.overlay').toggleClass('showlay');
    $('.navbar-toggle').toggleClass('fade');
    $('.login-toggle').toggleClass('fade');
 } 


 getAllStoresData(pageType) {
  
   this.dataService.getAllStores()
      .subscribe(data => {
          
          if(data.length > 0) {
            data.forEach((dat) => {
              if(dat.Id == pageType) {
                this.pageTitle = dat.Country + ' : ' + pageType;
                this.countryId = dat.Country;
              }
            });
          }
      });
 }


 getNetSalesData(type, id) {
    this.dataService.getNetSales(type, id)
      .subscribe(data => {
        var key = type+'NetSales';
       this.netSalesGlobal = parseInt(data[key]);
      });
 }

 getGrossSalesData(type, id) {
    this.dataService.getGrossSales(type, id)
      .subscribe(data => {
           var key = type+'GrossSales';
           this.grossSalesGlobal = parseInt(data[key]);
      }); 
 }

  redirectToCountry() {
    let countryId = this.dataService.getCountryId();
    this.router.navigate(['/country/'+countryId]);
  }


}
