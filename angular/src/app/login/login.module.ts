import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule, FormsModule],
  declarations: [LoginComponent],
  providers: [LoginService],
})
export class LoginModule { }
