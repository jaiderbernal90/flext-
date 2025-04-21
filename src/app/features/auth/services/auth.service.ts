import { ApiBaseService } from '@/app/shared/services/api-base.service';
import { Injectable } from '@angular/core';
import { LoginBody, ResponseLogin } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiBaseService {

  async login(data: LoginBody): Promise<ResponseLogin> {
    return await this.post<ResponseLogin>('auth/login', data);
  }
}
