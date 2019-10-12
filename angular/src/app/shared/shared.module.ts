import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [JwPaginationComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: localStorage.getItem('apiKey')
    })
  ],
  exports: [
    AgmCoreModule,
    ReactiveFormsModule,
    JwPaginationComponent,
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class SharedModule {}
