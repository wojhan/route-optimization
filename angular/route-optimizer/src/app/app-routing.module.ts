import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/pages/login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationCompleteComponent } from './registration/registration-complete/registration-complete.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'register/complete', component: RegistrationCompleteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
