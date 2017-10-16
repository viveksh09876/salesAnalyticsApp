import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataService } from './data-service.service';
import { LoginComponent } from './login/login.component';
import { MasonryModule } from 'angular2-masonry';
import { StoreComponent } from './store/store.component';
import { CountryComponent } from './country/country.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { TooltipModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    StoreComponent,
    CountryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ChartsModule,
    MasonryModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDYtuXiyW5UADcsSbjuPCS9YTkNU5y9w8I'
    }),
    MalihuScrollbarModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
