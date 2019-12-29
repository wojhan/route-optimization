import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesComponent } from './employees.component';
import { RouterModule } from '@angular/router';
import { EmployeeBusinessTripsComponent } from './employee-business-trips/employee-business-trips.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeBusinessTripsListComponent } from './employee-business-trips/employee-business-trips-list/employee-business-trips-list.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeListComponent,
    EmployeeBusinessTripsComponent,
    EmployeeFormComponent,
    EmployeeEditComponent,
    EmployeeBusinessTripsListComponent
  ],
  imports: [SharedModule, RouterModule]
})
export class EmployeesModule {}
