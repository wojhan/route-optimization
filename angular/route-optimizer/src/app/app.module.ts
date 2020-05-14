import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import localePlExtra from '@angular/common/locales/extra/pl';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpConfigInterceptor } from './core/interceptors/http-config.interceptor';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { RequisitionsModule } from './modules/dashboard/pages/requisitions/requisitions.module';
import { MyBusinessTripsModule } from './modules/dashboard/pages/my-business-trips/my-business-trips.module';
import { BusinessTripsModule } from './modules/business-trips/business-trips.module';
import { MapModule } from '@route-optimizer/modules/map/map.module';
import { UserResolve } from '@route-optimizer/core/UserResolve';

registerLocaleData(localePl, localePlExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LoginModule,
    RegistrationModule,
    ToastrModule.forRoot()
  ],
  providers: [UserResolve, { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
