import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountryComponent } from './country/country.component';
import { StoreComponent } from './store/store.component';

const appRoutes: Routes = [ 
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent  },
    { path: 'dashboard', component: DashboardComponent  },
    { path: 'country/:id', component: CountryComponent  },
    { path: 'store/:id', component: StoreComponent  }
]; 

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });