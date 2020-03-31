import { NgModule } from '@angular/core';
import { RegistrationPage } from './pages/registration.page';
import { RegistrationCompletePage } from './pages/registration-complete.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [RegistrationPage, RegistrationCompletePage],
  imports: [SharedModule]
})
export class RegistrationModule {}
