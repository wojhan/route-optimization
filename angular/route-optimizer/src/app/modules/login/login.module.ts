import { NgModule } from '@angular/core';
import { LoginPage } from './pages/login.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [LoginPage],
  imports: [SharedModule]
})
export class LoginModule {}
