import { User } from '@/app/features/users/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getToken(): User {
    return jwtDecode(sessionStorage.getItem('token') || '');
  }

  removeToken(): void {
    sessionStorage.removeItem('token');
  }

  getPermissionsUser(): string[] {
    const token = this.getToken();
    if (!token?.role?.permissions) {
      return [];
    }
    return token.role.permissions.map((p) => p.name);
  }
}
