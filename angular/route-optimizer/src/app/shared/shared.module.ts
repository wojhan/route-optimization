import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

// import { BreadcrumbModule } from 'primeng';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { AgmDirectionModule } from 'agm-direction';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { MaterialModule } from '../material/material.module';
import { PaginatorComponent } from '../paginator/paginator.component';
import { LdsRollerComponent } from './components/lds-roller/lds-roller.component';

@NgModule({
  declarations: [JwPaginationComponent, DeleteModalComponent, PaginatorComponent, LdsRollerComponent],
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
    AgmDirectionModule,
    BreadcrumbModule
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
    PaginatorComponent,
    LdsRollerComponent,
    BreadcrumbModule
  ],
  providers: [GoogleMapsAPIWrapper]
})
export class SharedModule {}
