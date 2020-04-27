import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './modules/login/pages/login.page';
import { RegistrationPage } from './modules/registration/pages/registration.page';
import { RegistrationCompletePage } from './modules/registration/pages/registration-complete.page';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginPage, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegistrationPage, canActivate: [NoAuthGuard] },
  { path: 'register/complete', component: RegistrationCompletePage, canActivate: [NoAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
