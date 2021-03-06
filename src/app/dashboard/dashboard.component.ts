import { Component, OnInit, AfterViewInit,ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DataService } from '../data-service.service';
import { BaseChartDirective } from 'ng2-charts';
import { MasonryModule, MasonryOptions  } from 'angular2-masonry';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import * as $ from 'jquery';


declare var Packery: any;
declare var Draggabilly: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('grid') grid;
  @ViewChild('netSalesVal') netSalesVal;
  @ViewChild('grossSalesVal') grossSalesVal;

  constructor(private dataService: DataService, private mScrollbarService: MalihuScrollbarService) { }

  ngOnInit() {

    this.getGlobalDashboardData();


     $('.navbar-toggle').click(function(){
        $(this).toggleClass('cross');
	    	$('#Main_menu').toggleClass('show');
        $('body').toggleClass('noshow');
        $('.overlay').toggleClass('showlay');
	    	$('.login-toggle').toggleClass('fade');
        return false;    
    });
   

  }


  ngAfterViewInit() {
       $('.graph_section .common_box h4 i').click(function(){
        
        $(this).parent().toggleClass('arrow');
        $(this).parent().next().slideToggle();
          return false;
      });
  
  }

  ngOnDestroy() {
    this.mScrollbarService.destroy('.graph_section .common_box.half .indicate_list');
  }

  
  toggleDaySec(event){
      $('.calender_sec').slideToggle();
    }


  globalDashBoardData = {};  
  stores: Array<any>;
  markers: Array<any>;
  netSalesGlobal: number;
  grossSalesGlobal: number;
  newCustomers: number;
  oldCustomers: number;
  laborCost: number;
  laborCostPerc: number;
  deliveryCount: number;
  deliveryValue: number;
  voidsCount: number;
  voidsValue: number;
  paymentsData: Array<any>;
  taxAmount: number;
  orderTypes: Array<any>;
  speedlineCount: number;
  speedlineValue: number;
  topCoupon: Array<any>;
  colorCodes = ['#4d5a31','#69813c','#7b984e','#abc380','#b7ce97','#bed09c','#c5d5a5',
                  '#921b28','#882d2e','#90292b','#98262e','#b21f29','#be302d','#cc6d50'];

  selectedCurrency = 'USD';                

  zoom: number = 1;
  lat: number = 51.673858;
  lng: number = 7.815982;
 
  

 countryData: Array<any> = []; 

 isAllGraphInitialized() {
   if(this.isStoresDataAvailable && this.isSalesCategoryDataAvailable && this.isPaymentDataAvailable && this.isDiscountDataAvailable && this.isCustomerDataAvailable && this.isOtdDataAvailable && this.isDelAreaDataAvailable && this.isTopEmpDataAvailable && this.isOrderDataAvailable) {
     this.initPackery();
   }
 }

 showLoader = true;

 initPackery() {
   
     var packery = new Packery(this.grid.nativeElement, {
        itemSelector: '.grid-item', gutter: 20, columnWidth: '.grid-item' });

        if(window.screen.width > 480) {
            packery.getItemElements().forEach( function( itemElem ) {
            var draggie = new Draggabilly( itemElem, {
            handle: '.header'
          });
            packery.bindDraggabillyEvents( draggie );
          });
        }

      this.mScrollbarService.initScrollbar('.graph_section .common_box.half .indicate_list', { axis: 'y', theme: 'dark', scrollButtons: { enable: false } });
  
      this.showLoader = false;
 }


 isStoresDataAvailable = false;

 formatStoreData(data, currency) {
   
        let markersArr: Array<any> = [];
        let alreadyCountry: Array<any> = [];
        
        Object.keys(data).forEach(function(key,index) {

            if(data[key].Stores){
              
              Object.keys(data[key].Stores).forEach(function(keyInner,indexInner) {
                
                let m = {
                  lat: parseFloat(data[key].Stores[keyInner].Lat),
                  lng: parseFloat(data[key].Stores[keyInner].Long),
                  label: '',
                  draggable: false,
                  color: '#'+data[key].Color,
                  infoText: key
                }
              
                markersArr.push(m);
              });
            }
        });
  
        this.markers = markersArr;        
        this.isStoresDataAvailable = true;   
        this.isAllGraphInitialized(); 
 }




 getGlobalDashboardData() {
    this.dataService.getGlobalDashboard()
      .subscribe(data => {
          this.globalDashBoardData = data;
          this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
          document.getElementById('pageTitle').innerHTML = 'Global';     
      });
 }


 getValuesInSelectedCurrency(data, currency, updateColors) {

      //store data data
      this.formatStoreData(data['Country'], currency);


      //net sales global
      this.netSalesGlobal = parseInt(data['Net Sales'].Value[currency]);
      document.getElementById('netSalesValId').innerHTML = this.netSalesGlobal.toString();

      //gross sales global
      this.grossSalesGlobal = parseInt(data['Gross Sales'].Value[currency]);
      document.getElementById('grossSalesValId').innerHTML = this.grossSalesGlobal.toString();

      //country data
      this.prepareCountryData(data['Country'], currency);

      //customers
      this.newCustomers = parseInt(data.Customers.New);
      this.oldCustomers = parseInt(data.Customers.Repeat);
      this.customersData.push(this.newCustomers);
      this.customersData.push(this.oldCustomers);
      this.isCustomerDataAvailable = true;

      //Labor Cost
      this.laborCost = parseInt(data['Labor Cost'].Value[currency]);
      this.laborCostPerc = parseInt(data['Labor Cost'].Percentage); 

      //Delivery Charges
      this.deliveryCount = parseInt(data['Delivery Charges'].Qty);
      this.deliveryValue = parseInt(data['Delivery Charges'].Value[currency]); 

      //Taxes data
      this.taxAmount = parseInt(data.Taxes.Value[currency]);

      //Voids Data
      this.voidsCount = parseInt(data.Voids.Qty);
      this.voidsValue = parseInt(data.Voids.Value[currency]);

      //order types 
      this.prepareOrderTypesData(data['Order Types'], currency, updateColors);

      //payment types
      this.preparePaymentTypesData(data['Payment Types'], currency, updateColors);

      //sales by category
      this.prepareSalesCategoryData(data['Sales By Category'], currency, updateColors);

      //Discounts 
      this.prepareDiscountData(data['Discounts'], currency, updateColors);

      //top employee
      this.prepareTopEmployeeData(data['Top Selling Employees'], currency);

      //top delivery area
      this.prepareDelAreaData(data['Top 5 Delivery Areas']);

      //speedline connect data
      this.speedlineCount = parseInt(data['Speedline Connect'].Qty);
      this.speedlineValue = parseInt(data['Speedline Connect'].Value[currency]);

      //out the door time
      this.prepareOtdData(data['Out the Door Time']);

 }


 //currency change 
 changeCurrency(selectedCurrency) {
    this.getValuesInSelectedCurrency(this.globalDashBoardData, selectedCurrency, false);
 }


 //format country data
 prepareCountryData(data, currency) {

    this.countryData = [];
    let cData = [];
    Object.keys(data).forEach(function(key,index) { 
       let ctData = {
                  country: key,
                  sales: parseInt(data[key]['Net Sales'][currency]),
                  color: '#' + data[key].Color
              }

        cData.push(ctData);           
    }); 

    this.countryData = cData;           
                
 }


 //order types
  orderTypesLabels:string[] = [];
  orderTypesData:number[] = [];                     
 
  orderTypesOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  otColors: Array<any> = [];
  orderTypesColors: Array<any> = [
      { 
        backgroundColor: []
  }];

  isOrderDataAvailable = false;
  orderTypesCenterData: any = {};


 prepareOrderTypesData(data, currency, updateColors) {
    
        let otArr: Array<any> = [];
        let otLabels: Array<any> = [];
        let otData: Array<any> = [];
        let otColor: Array<any> = [];
        let totalCount: number = 0;
        let centerData = {qty: 0, val: 0};
        let colCodes = this.colorCodes;


        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });

        Object.keys(data).forEach(function(key,index) {       
          
          let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);
          
          //let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);          
          let perc = (parseInt(data[key].Count)/totalCount)*100;

            let ot = {
              type: key,
              count: data[key].Count,
              value: parseInt(data[key].Value[currency]),
              color: dynamicColor,
              perc: Math.round(perc*10)/10
            }

            centerData.qty += parseInt(ot.count);
            centerData.val += ot.value;

            otArr.push(ot);
            otLabels.push(key);
            otData.push(data[key].Count);
            otColor.push(ot.color);
            
        });

        otArr = this.dataService.assignColors(otArr, true, 'color');
        otColor = this.dataService.assignColors(otColor, false, '');
        this.orderTypesCenterData = centerData;
        this.orderTypesLabels = otLabels;
        this.orderTypes = otArr;
        this.orderTypesData = otData;

        if(updateColors) {
          this.otColors = otColor;
          this.orderTypesColors[0].backgroundColor = otColor;
        }
        
        this.isOrderDataAvailable = true;   
        this.isAllGraphInitialized();     
           
 }


  

 

  
  styles = [
    { "elementType": "geometry","stylers": [{"color": "#CCD7B9"}] },
    { "elementType": "labels",  "stylers": [{"visibility": "off"}] },
    { "elementType": "labels.icon", "stylers": [{"visibility": "off"}] },
    { "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
    { "elementType": "labels.text.stroke", "stylers": [{"color": "#f5f5f5"}] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{"visibility": "off"}] },
    { "featureType": "administrative.land_parcel", "stylers": [{"visibility": "off"}] },
    { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill","stylers": [{"color": "#ffffff"}] },
    { "featureType": "administrative.neighborhood","stylers": [{"visibility": "off"}] },
    {"featureType":"poi","stylers":[{"visibility":"off"}]},
    {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#CCD7B9"}]},
    {"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},
    {"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},
    {"featureType":"road","stylers":[{"visibility":"off"}]},
    {"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
    {"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},
    {"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},
    {"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},
    {"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},
    {"featureType":"transit","stylers":[{"visibility":"off"}]},
    {"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},
    {"featureType":"water","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}
];
  
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: MouseEvent) {
    /*this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });*/
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

 

 //sales by category
  salesCategoryLabels:string[] = [];
  salesCategoryData:number[] = [];                     
 
  salesCategoryOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  scColors: Array<any> = [];
  salesCategoryColors: Array<any> = [
      { 
        backgroundColor: []
  }];
  salesCategory: Array<any>;

  isSalesCategoryDataAvailable = false;

  salesCategoryCenterData:any = {qty: 0, val: 0};


 prepareSalesCategoryData(data, currency, updateColors) {
    
        let scArr: Array<any> = [];
        let scLabels: Array<any> = [];
        let scData: Array<any> = [];
        let scColor: Array<any> = [];
        let totalCount: number = 0;
        let colCodes = this.colorCodes;
        
        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });
        
        let centerData = {qty: 0, val: 0};
        Object.keys(data).forEach(function(key,index) {    
            
          let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);

          //let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            let perc = (data[key].Count/totalCount)*100;

            let sc = {
              type: key,
              count: data[key].Count,
              value: parseInt(data[key].Value[currency]),
              color: dynamicColor,
              countPerc: Math.round(perc*10)/10
            }
            
            centerData.qty += parseInt(sc.count);
            centerData.val += sc.value;

            scArr.push(sc);
            scLabels.push(sc.type);
            scData.push(sc.count);
            scColor.push(sc.color);
            
        });

        scArr = this.dataService.assignColors(scArr, true, 'color');
        scColor = this.dataService.assignColors(scColor, false, '');
        this.salesCategoryCenterData = centerData;
        this.salesCategoryLabels = scLabels;
        this.salesCategory = scArr;
        this.salesCategoryData = scData;

        if(updateColors) {
           this.scColors = scColor;
           this.salesCategoryColors[0].backgroundColor = scColor;
        }

        this.isSalesCategoryDataAvailable = true; 
        this.isAllGraphInitialized();
        
  }

  

  
  //payment types
  paymentTypesLabels:string[] = [];
  paymentTypesData:number[] = [];                     
 
  paymentTypesOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  ptColors: Array<any> = [];
  paymentTypesColors: Array<any> = [
      { 
        backgroundColor: []
  }];
  paymentTypes: Array<any>;

  isPaymentDataAvailable = false;
  paymentTypesCenterData: any = { qty: 0, val: 0};


 preparePaymentTypesData(data, currency, updateColors) {
    
        let ptArr: Array<any> = [];
        let ptLabels: Array<any> = [];
        let ptData: Array<any> = [];
        let ptColor: Array<any> = [];
        let totalCount: number = 0;
        let colCodes = this.colorCodes;
        let ptCenterData = { qty: 0, val: 0};
        
        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });
        
        Object.keys(data).forEach(function(key,index) {     

           let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);

         // let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            let perc = (data[key].Count/totalCount)*100;

            let pt = {
              type: key,
              count: data[key].Count,
              value: parseInt(data[key].Value[currency]),
              color: dynamicColor,
              countPerc: Math.round(perc*10)/10
            }

            ptCenterData.qty += parseInt(pt.count);
            ptCenterData.val += pt.value;
 
            ptArr.push(pt);
            ptLabels.push(pt.type);
            ptData.push(pt.count);
            ptColor.push(pt.color);
            
        });

        ptArr = this.dataService.assignColors(ptArr, true, 'color');
        ptColor = this.dataService.assignColors(ptColor, false, '');
        this.paymentTypesCenterData = ptCenterData;
        this.paymentTypesLabels = ptLabels;
        this.paymentTypes = ptArr;
        this.paymentTypesData = ptData;

        if(updateColors) {
          this.ptColors = ptColor;
          this.paymentTypesColors[0].backgroundColor = ptColor;
        }
        
        this.isPaymentDataAvailable = true; 
        this.isAllGraphInitialized();
             
  }


  //discounts
  discountLabels:string[] = [];
  discountData:number[] = [];                     
 
  discountOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  dColors: Array<any> = [];
  discountColors: Array<any> = [
      { 
        backgroundColor: []
  }];

  discount: Array<any>;
  isDiscountDataAvailable = false;

  discountsCenterData:any = { qty: 0, val: 0};





 
 prepareDiscountData(data, currency, updateColors) {
        
        this.getTopCouponData(data.Coupon.Top, currency);

        let dArr: Array<any> = [];
        let dLabels: Array<any> = [];
        let dData: Array<any> = [];
        let dColor: Array<any> = [];
        let totalCount: number = 0;
        let colCodes = this.colorCodes;
        

        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });

        let centerData = { qty:0, val: 0};

        Object.keys(data).forEach(function(key,index) {       

          let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);  
          
          //let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);
          let perc = (parseInt(data[key].Count)/totalCount)*100;
          

            let ot = {
              type: key,
              count: data[key].Count,
              value: parseInt(data[key].Value[currency]),
              color: dynamicColor,
              perc: Math.round(perc*10)/10
            }

            centerData.qty += parseInt(ot.count);
            centerData.val += ot.value;

            dArr.push(ot);
            dLabels.push(key);
            dData.push(data[key].Count);
            dColor.push(ot.color);
            
        });

        dArr = this.dataService.assignColors(dArr, true, 'color');
        dColor = this.dataService.assignColors(dColor, false, '');
        this.discountsCenterData = centerData;
        this.discountLabels = dLabels;
        this.discount = dArr;
        this.discountData = dData;

        if(updateColors) {
            this.dColors = dColor;
            this.discountColors[0].backgroundColor = dColor;
        }

        this.isDiscountDataAvailable = true;  
        this.isAllGraphInitialized();      
          
 }


  //customers
  customersLabels:string[] = ['New Customers', 'Old Customers'];
  customersData:number[] = [];                     
  customersType:string = 'doughnut';
  customersOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  isCustomerDataAvailable = false;
  customersColors: any[] = [
      { 
        backgroundColor:["#006837", "#8cc63f"] 
  }];




  //out the door 
  otdOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
         barPercentage: 0.5,
         gridLines: { display:false }
     }],
      yAxes: [{              
              // ticks: { min: 0, max: 60, stepSize: 10 },
               ticks: { min: 0 },
              gridLines: { display:false }
        }]
    }
    
  };
  otdLabels:string[] = [];
  otdLegend:boolean = true;
  otdData:any[] = [{data: []}];
  otdColors: any[] = [{ backgroundColor: "#7b984e" }];
  isOtdDataAvailable = false;
  otdAvg = 0;

  prepareOtdData(data){

        let oLabels: Array<any> = [];
        let oData: Array<any> = [];        
        let otdAvg = 0;

        Object.keys(data).forEach(function(key,index) { 
            if(key != 'Avg') {
              oLabels.push(key);
               oData.push(parseInt(data[key]));
            }else{
              otdAvg = parseInt(data[key]);
            }
            
        });
        
        this.otdAvg = otdAvg;
        this.otdLabels = oLabels;        
        this.otdData[0].data = oData;             
        this.isOtdDataAvailable = true; 
        this.isAllGraphInitialized();
             
  }

  
  //delivery area
  delAreaOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
         barPercentage: 0.5,
         gridLines: { display:false }
     }],
      yAxes: [{              
              // ticks: { min: 0, max: 60, stepSize: 10 },
               ticks: { min: 0 },
              gridLines: { display:false }
        }]
    }
    
  };
  delAreaLabels:string[] = [];
  delAreaLegend:boolean = true;
  delAreaData:any[] = [{data: []}];
  delAreaColors: any[] = [{ backgroundColor: "#7b984e" }];
  isDelAreaDataAvailable = false;


  prepareDelAreaData(data){

        let dLabels: Array<any> = [];
        let dData: Array<any> = [];        
        
        data.forEach((del) => {  
           
              let labelTxt = this.truncateText(del.Name, 6);
              dLabels.push(labelTxt);
              dData.push(parseInt(del.Orders));
                     
        });
        
        this.delAreaLabels = dLabels;        
        this.delAreaData[0].data = dData;             
        this.isDelAreaDataAvailable = true; 
        this.isAllGraphInitialized();     
      
  }


  //top employee
  topEmpOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
         barPercentage: 0.5, 
         gridLines: { display:false }
     }],
      yAxes: [{              
              // ticks: { min: 0, max: 5000, stepSize: 500 },
              ticks: { min: 0 },
              gridLines: { display:false }
        }]
    }
    
  };
  
  topEmpLabels:string[] = [];
  topEmpLegend:boolean = true;
  topEmpData:any[] = [{data: []}];
  topEmpColors: any[] = [{ backgroundColor: "#7b984e" }];
  isTopEmpDataAvailable = false;


  prepareTopEmployeeData(data, currency){
    
        let eLabels: Array<any> = [];
        let eData: Array<any> = [];        
        
       Object.keys(data).forEach(function(key,index) { 
           
            eLabels.push(key);
            eData.push(parseInt(data[key].NetSales[currency]));
            
        });
        
        this.topEmpLabels = eLabels;        
        this.topEmpData[0].data = eData;             
        this.isTopEmpDataAvailable = true; 
        this.isAllGraphInitialized();     
      
  }


  isTopCouponDataAvailable = false;
  getTopCouponData(data, currency) {
      let datArr = [];
      Object.keys(data).forEach(function(key,index) {   
          
          let dat = {
            name: key,
            count: parseInt(data[key].Count),
            value: parseInt(data[key].Value[currency])
          }

          datArr.push(dat);
      });

      this.topCoupon = datArr;
      this.isTopCouponDataAvailable = true;
      this.isAllGraphInitialized();    
  }
 


  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  

  truncateText(str, limit) {
    return (str.length < limit) ? str : str.substring(0, limit) + '...';
  }


  randomValfromArr(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
  }


}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
  color: string;
  infoText: string;
}



