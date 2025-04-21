import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const tokenSvc = inject(TokenService);

    const permissions = tokenService.getPermissionsUser();

    if (permissions?.includes(requiredPermission)) {
      return true;
    }

    tokenSvc.removeToken();
    router.navigate(['/iniciar-sesion']);
    return false;
  };
};
