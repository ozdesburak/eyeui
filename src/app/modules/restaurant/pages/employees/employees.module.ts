import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';

@NgModule({
  imports: [
    EmployeesRoutingModule,
    EmployeesComponent
  ]
})
export class EmployeesModule {} 