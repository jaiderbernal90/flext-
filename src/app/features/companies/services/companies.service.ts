import { ApiBaseService } from '@shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { Company } from '../interfaces/company.interface';
import { ApiPaginationResponse } from '../../../shared/interfaces/api.response.interface';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService extends ApiBaseService {
  private readonly endpoint = 'companies';

  async getCompanies(params?: any): Promise<ApiPaginationResponse<Company[]>> {
    return this.get<ApiPaginationResponse<Company[]>>(this.endpoint, params);
  }

  async getCompanyById(id: number): Promise<Company> {
    return this.get<Company>(`${this.endpoint}/${id}`);
  }

  async createCompany(company: Company): Promise<Company> {
    return this.post<Company>(this.endpoint, company);
  }

  async updateCompany(company: Company, id: number): Promise<Company> {
    return this.patch<Company>(`${this.endpoint}`, id, company);
  }

  async deleteCompany(id: number): Promise<void> {
    return this.delete<void>(this.endpoint, id);
  }
}
