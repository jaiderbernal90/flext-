import { ApiBaseService } from '@shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { ApiPaginationResponse } from '../../../shared/interfaces/api.response.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiBaseService {
  private readonly endpoint = 'users';

  async getUsers(params?: any): Promise<ApiPaginationResponse<User[]>> {
    return this.get<ApiPaginationResponse<User[]>>(this.endpoint, params);
  }

  async getUserById(id: number): Promise<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  async createUser(company: User): Promise<User> {
    return this.post<User>(this.endpoint, company);
  }

  async updateUser(company: User, id: number): Promise<User> {
    return this.patch<User>(`${this.endpoint}`, id, company);
  }

  async deleteUser(id: number): Promise<void> {
    return this.delete<void>(this.endpoint, id);
  }
}
