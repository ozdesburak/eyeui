import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileRoutingModule } from './employee-profile-routing.module';
import { EmployeeProfileComponent } from './employee-profile.component';

@NgModule({
  imports: [
    CommonModule,
    EmployeeProfileRoutingModule,
    EmployeeProfileComponent
  ]
})
export class EmployeeProfileModule { } 