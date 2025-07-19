import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMenuComponent } from './customer-menu.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerMenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMenuRoutingModule { } 