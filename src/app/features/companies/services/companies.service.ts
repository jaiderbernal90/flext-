import { ApiBaseService } from '@shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { Company } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService extends ApiBaseService {

  getAll(params?: any): Promise<Company[]> {
    return this.get<Company[]>('user', params);
  }
}
