import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MaterialModule } from '../modules/material/material.module';
import { LdsRollerComponent } from './components/lds-roller/lds-roller.component';
import { PaginatorComponent } from './components/paginator/paginator.component';

// import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
// import { MaterialModule } from '../material/material.module';
// import { PaginatorComponent } from '../paginator/paginator.component';
// import { LdsRollerComponent } from './components/lds-roller/lds-roller.component';
// import { MapComponent } from '../map/map.component';

@NgModule({
  declarations: [LdsRollerComponent, JwPaginationComponent, PaginatorComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MaterialModule,
    BreadcrumbModule
  ],
  exports: [
    ReactiveFormsModule,
    JwPaginationComponent,
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    // DeleteModalComponent,
    // PaginatorComponent,
    LdsRollerComponent,
    BreadcrumbModule,
    PaginatorComponent
    // MapComponent
  ]
})
export class SharedModule {}
