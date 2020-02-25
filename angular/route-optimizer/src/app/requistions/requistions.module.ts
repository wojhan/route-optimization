import { NgModule } from '@angular/core';
import { RequistionListComponent } from './requistion-list/requistion-list.component';
import { RequistionAddComponent } from './requistion-add/requistion-add.component';
import { RequistionDetailsComponent } from './requistion-details/requistion-details.component';
import { RequistionEditComponent } from './requistion-edit/requistion-edit.component';
import { RequistionFormComponent } from './requistion-form/requistion-form.component';
import { RequistionsComponent } from './requistions.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EditRequisitionModalComponent } from './requistion-list/components/edit-requisition-modal/edit-requisition-modal.component';

@NgModule({
  declarations: [
    RequistionListComponent,
    RequistionAddComponent,
    RequistionDetailsComponent,
    RequistionEditComponent,
    RequistionFormComponent,
    RequistionsComponent,
    EditRequisitionModalComponent
  ],
  entryComponents: [EditRequisitionModalComponent],
  imports: [RouterModule, SharedModule]
})
export class RequistionsModule {}
