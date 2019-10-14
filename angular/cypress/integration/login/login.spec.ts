/// <reference types="cypress" />

// Required for JIT in NG-7
import 'core-js/es7/reflect';
// import { ApplicationRef, NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'zone.js';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { LoginService } from '../../../src/app/login/login.service';
import { NgModule, ApplicationRef } from '@angular/core';
import { LoginComponent } from '../../../src/app/login/login.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient } from '@angular/common/http';
// import { LoginService } from 'src/app/login/login.service';

// dynamic loading based on blog post
// https://blog.angularindepth.com/how-to-manually-bootstrap-an-angular-application-9a36ccf86429

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule
//   ],
//   providers: [],
//   entryComponents: [AppComponent]
// })
// class AppModule {
//   app: ApplicationRef;
//   ngDoBootstrap(app: ApplicationRef) {
//     this.app = app;
//   }
// }

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [HttpClientTestingModule],
  providers: [LoginService]
})
class LoginModule {
  app: ApplicationRef;
  ngDoBootstrap(app: ApplicationRef) {
    this.app = app;
  }
}


/* eslint-env mocha */
/* global cy */
describe('LoginService', () => {
  // let service: LoginService;
  // let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const html = `
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <app-login></app-login>
      </body>
    `
    const document = (cy as any).state('document');

    document.write(html);
    document.close();

    cy.get('app-login').then(el$ => {
      platformBrowserDynamic()
        .bootstrapModule(LoginModule)
        .then((moduleRef) => {
          moduleRef.instance.app.bootstrap(LoginComponent, el$.get(0));
        });
    });


    // const html = `
    //   <head>
    //     <meta charset="UTF-8">
    //   </head>
    //   <body>
    //     <app-root></app-root>
    //   </body>
    // `;
    // const document = (cy as any).state('document');
    // document.write(html);
    // document.close();

    // cy.get('app-root').then(el$ => {
    //   platformBrowserDynamic()
    //     .bootstrapModule(AppModule)
    //     .then(function (moduleRef) {
    //       moduleRef.instance.app.bootstrap(AppComponent, el$.get(0));
    //     });
    // });
  });

  it('works', () => {

    const test = cy.stub();
    console.log(test);
    // cy.contains('Welcome to angular-cypress-unit').should('be.visible');
  });

  // it('works again', () => {
  //   // cy.contains('Welcome to angular-cypress-unit').should('be.visible');
  // });
});
