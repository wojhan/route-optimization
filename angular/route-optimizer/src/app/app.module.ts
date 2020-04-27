import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import localePlExtra from '@angular/common/locales/extra/pl';
import { HttpConfigInterceptor } from './core/interceptors/http-config.interceptor';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { CompaniesModule } from './modules/dashboard/pages/companies/companies.module';
import { RequisitionsModule } from './modules/dashboard/pages/requisitions/requisitions.module';
import { MyBusinessTripsModule } from './modules/dashboard/pages/my-business-trips/my-business-trips.module';
import { ToastrModule } from 'ngx-toastr';
registerLocaleData(localePl, localePlExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DashboardModule,
    CompaniesModule,
    RequisitionsModule,
    MyBusinessTripsModule,
    LoginModule,
    RegistrationModule,
    ToastrModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
