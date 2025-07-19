import { NgModule } from '@angular/core';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';

@NgModule({
  imports: [
    OrdersRoutingModule,
    OrdersComponent
  ]
})
export class OrdersModule {} 