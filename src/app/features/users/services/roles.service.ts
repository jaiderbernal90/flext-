import { ApiBaseService } from '@shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { Role } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends ApiBaseService {
  private readonly endpoint = 'roles';

  async getRoles(params?: any): Promise<Role[]> {
    return this.get<Role[]>(this.endpoint, params);
  }
}
