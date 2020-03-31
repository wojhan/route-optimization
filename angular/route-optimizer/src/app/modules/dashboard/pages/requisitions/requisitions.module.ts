import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { RequistionsPage } from './pages/requistions.page';
import { RequistionListPage } from './pages/requistion-list.page';
import { RequisitionEditModal } from './components/modals/requisition-edit.modal';

@NgModule({
  declarations: [RequistionsPage, RequistionListPage, RequisitionEditModal],
  entryComponents: [RequisitionEditModal],
  imports: [SharedModule]
})
export class RequisitionsModule {}
