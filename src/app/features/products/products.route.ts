import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list-products/list-products.component').then(
        (m) => m.ListProductsComponent
      ),
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/edit-product/edit-product.component').then(
        (m) => m.EditProductComponent
      ),
  },
];
