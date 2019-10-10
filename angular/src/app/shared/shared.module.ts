import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [JwPaginationComponent],
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  exports: [JwPaginationComponent, CommonModule, FontAwesomeModule]
})
export class SharedModule {}
