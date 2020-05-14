import { NgModule } from '@angular/core';

import { SharedModule } from '@route-optimizer/shared/shared.module';
import { BaseLayoutComponent } from '@route-optimizer/modules/base-layout/base-layout.component';
import { BaseLayoutSidebarComponent } from './components/base-layout-sidebar/base-layout-sidebar.component';
import { BaseLayoutNavbarComponent } from './components/base-layout-navbar/base-layout-navbar.component';
import { BaseLayoutUserSidebarComponent } from './components/base-layout-user-sidebar/base-layout-user-sidebar.component';

@NgModule({
  declarations: [BaseLayoutComponent, BaseLayoutSidebarComponent, BaseLayoutNavbarComponent, BaseLayoutUserSidebarComponent],
  imports: [SharedModule],
  exports: [BaseLayoutComponent, BaseLayoutSidebarComponent, BaseLayoutUserSidebarComponent]
})
export class BaseLayoutModule {}
