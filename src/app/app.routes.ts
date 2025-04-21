import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent),
  // },
  // {
  //   path: 'usuarios',
  //   loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
  // },
  // {
  //   path: 'productos',
  //   loadChildren: () => import('./features/users/users.component').then(m => m.UsersComponent),
  // },
  {
    path: 'companias',
    loadChildren: () => import('./features/companies/companies.route').then(m => m.companiesRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
