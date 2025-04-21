import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list-users/list-users.component').then(
        (m) => m.ListUsersComponent
      ),
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/add-user/add-user.component').then(
        (m) => m.AddUserComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/edit-user/edit-user.component').then(
        (m) => m.EditUserComponent
      ),
  },
];
