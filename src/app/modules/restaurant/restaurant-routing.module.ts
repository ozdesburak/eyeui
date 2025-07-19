import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantComponent } from './restaurant.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'tables',
        loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
      },
      {
        path: 'payments',
        loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsModule),
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule),
      },
      {
        path: 'employees',
        loadChildren: () => import('./pages/employees/employees.module').then(m => m.EmployeesModule),
      },
      {
        path: 'employees-detail',
        loadChildren: () => import('./pages/employees/employee-detail/employee-detail.module').then(m => m.EmployeeDetailModule),
      },
      {
        path: 'employee-profile/:id',
        loadChildren: () => import('./pages/employee-profile/employee-profile.module').then(m => m.EmployeeProfileModule),
      },
      {
        path: 'customer-menu',
        loadChildren: () => import('./pages/customer-menu/customer-menu.module').then(m => m.CustomerMenuModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {} 