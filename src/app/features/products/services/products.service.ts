import { ApiBaseService } from '@shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { ApiPaginationResponse } from '../../../shared/interfaces/api.response.interface';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiBaseService {
  private readonly endpoint = 'products';

  async getProducts(params?: any): Promise<ApiPaginationResponse<Product[]>> {
    return this.get<ApiPaginationResponse<Product[]>>(this.endpoint, params);
  }

  async getProductById(id: number): Promise<Product> {
    return this.get<Product>(`${this.endpoint}/${id}`);
  }

  async createProduct(company: Product): Promise<Product> {
    return this.post<Product>(this.endpoint, company);
  }

  async updateProduct(company: Product, id: number): Promise<Product> {
    return this.patch<Product>(`${this.endpoint}`, id, company);
  }

  async deleteProduct(id: number): Promise<void> {
    return this.delete<void>(this.endpoint, id);
  }
}
