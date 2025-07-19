import { NgModule } from '@angular/core';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';

@NgModule({
  imports: [
    PaymentsRoutingModule,
    PaymentsComponent
  ]
})
export class PaymentsModule {} 