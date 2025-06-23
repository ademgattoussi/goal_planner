import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token;
  const expiration = localStorage.getItem('token_expiration');
  const isTokenValid = expiration && new Date(expiration) > new Date();

  if (token && isTokenValid) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  // If token exists but expired, clear auth data
  if (token && !isTokenValid) {
    authService.clearAuthData();
    router.navigate(['/login']);
  }
  
  return next(req);
};