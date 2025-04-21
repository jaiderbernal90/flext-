import { Routes } from '@angular/router';

export const companiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/list-companies/list-companies.component').then(m => m.ListCompaniesComponent),
  },
  {
    path: 'crear',
    loadComponent: () => import('./pages/add-company/add-company.component').then(m => m.AddCompanyComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/edit-company/edit-company.component').then(m => m.EditCompanyComponent),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
