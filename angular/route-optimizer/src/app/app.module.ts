import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginModule } from './login/login.module';
import { CompaniesModule } from './companies/companies.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesModule } from './employees/employees.module';
import { BusinessTripsModule } from './business-trips/business-trips.module';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import localePlExtra from '@angular/common/locales/extra/pl';
import { HttpConfigInterceptor } from './shared/http-config.interceptor';
import { RegistrationModule } from './registration/registration.module';
import { RequistionsModule } from './requistions/requistions.module';
registerLocaleData(localePl, localePlExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    LoginModule,
    RegistrationModule,
    CompaniesModule,
    BrowserAnimationsModule,
    EmployeesModule,
    BusinessTripsModule,
    RequistionsModule
  ],
  providers: [UserService, AuthGuard, CookieService, { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
