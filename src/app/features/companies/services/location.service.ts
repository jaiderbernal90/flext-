import { ApiBaseService } from '@shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { City, Department } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationsService extends ApiBaseService {
  async getDepartments(): Promise<Department[]> {
    return this.get<Department[]>('location/departments');
  }

  async getCitiesByDepartmentId(departmentId: number): Promise<City[]> {
    return this.get<City[]>(`location/cities/${departmentId}`);
  }
}
