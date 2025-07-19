import { NgModule } from '@angular/core';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

@NgModule({
  imports: [
    ProductsRoutingModule,
    ProductsComponent
  ]
})
export class ProductsModule {} 