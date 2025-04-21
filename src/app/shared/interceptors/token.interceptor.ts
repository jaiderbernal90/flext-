import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const token = sessionStorage.getItem('token');

    if (
      req.url.includes('/auth/login') ||
      req.url.includes('/auth/refresh-token')
    ) {
      return next(req);
    }

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return next(authReq).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              sessionStorage.removeItem('token');
              router.navigate(['/iniciar-sesion'], {
                queryParams: {
                  returnUrl: router.url,
                  reason: 'sesion-expirada',
                },
              });
            }

            if (error.status === 403) {
              router.navigate(['/iniciar-sesion']);
            }
          }

          return throwError(() => error);
        })
      );
    }
  }

  return next(req);
};
