import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { RegistrationCompleteComponent } from './registration-complete/registration-complete.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RegistrationComponent, RegistrationCompleteComponent],
  imports: [SharedModule, RouterModule]
})
export class RegistrationModule {}
