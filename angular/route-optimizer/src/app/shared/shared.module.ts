import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { AgmDirectionModule } from 'agm-direction';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { MaterialModule } from '../material/material.module';
import { PaginatorComponent } from '../paginator/paginator.component';

@NgModule({
  declarations: [JwPaginationComponent, DeleteModalComponent, PaginatorComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: localStorage.getItem('apiKey')
    }),
    AgmDirectionModule
  ],
  entryComponents: [DeleteModalComponent],
  exports: [
    AgmCoreModule,
    AgmDirectionModule,
    ReactiveFormsModule,
    JwPaginationComponent,
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    DeleteModalComponent,
    PaginatorComponent
  ],
  providers: [GoogleMapsAPIWrapper]
})
export class SharedModule {}
