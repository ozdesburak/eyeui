import { NgModule } from '@angular/core';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantComponent } from './restaurant.component';

@NgModule({
  imports: [
    RestaurantRoutingModule,
    RestaurantComponent
  ]
})
export class RestaurantModule {} 