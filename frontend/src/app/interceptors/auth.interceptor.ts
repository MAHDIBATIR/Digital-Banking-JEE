import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  // Skip authentication for public endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError(error => {
        // If we get a 401 Unauthorized or 403 Forbidden response,
        // redirect to the login page
        if (error.status === 401 || error.status === 403) {
          console.log('Authentication error:', error);
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // If no token is available, redirect to login
  router.navigate(['/login']);
  return next(req);
};
