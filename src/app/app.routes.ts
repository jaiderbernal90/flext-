import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { LayoutComponent } from './core/components/layout/layout.component';
import { permissionGuard } from './shared/guards/permissions.guard';

export const routes: Routes = [
  {
    path: 'iniciar-sesion',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'usuarios',
        canActivate: [authGuard, permissionGuard('view:user')],
        loadChildren: () =>
          import('./features/users/users.route').then((m) => m.usersRoutes),
      },
      {
        path: 'productos',
        canActivate: [authGuard, permissionGuard('view:product')],
        loadChildren: () =>
          import('./features/products/products.route').then(
            (m) => m.productsRoutes
          ),
      },
      {
        path: 'companias',
        canActivate: [authGuard, permissionGuard('view:company')],
        loadChildren: () =>
          import('./features/companies/companies.route').then(
            (m) => m.companiesRoutes
          ),
      },
      {
        path: '',
        redirectTo: 'companias',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'iniciar-sesion',
  },
];
