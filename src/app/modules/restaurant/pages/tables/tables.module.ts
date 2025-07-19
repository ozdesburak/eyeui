import { NgModule } from '@angular/core';
import { TablesRoutingModule } from './tables-routing.module';
import { TablesComponent } from './tables.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    TablesRoutingModule,
    TablesComponent,
    HttpClientModule
  ]
})
export class TablesModule {} 