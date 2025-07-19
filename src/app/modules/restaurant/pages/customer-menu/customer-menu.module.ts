import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerMenuRoutingModule } from './customer-menu-routing.module';
import { CustomerMenuComponent } from './customer-menu.component';

@NgModule({
  imports: [
    CommonModule,
    CustomerMenuRoutingModule,
    CustomerMenuComponent
  ]
})
export class CustomerMenuModule { } 