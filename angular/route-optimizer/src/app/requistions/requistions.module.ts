import { NgModule } from '@angular/core';
import { RequistionListComponent } from './requistion-list/requistion-list.component';
import { RequistionsComponent } from './requistions.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EditRequisitionModalComponent } from './requistion-list/components/edit-requisition-modal/edit-requisition-modal.component';

@NgModule({
  declarations: [RequistionListComponent, RequistionsComponent, EditRequisitionModalComponent],
  entryComponents: [EditRequisitionModalComponent],
  imports: [RouterModule, SharedModule]
})
export class RequistionsModule {}
