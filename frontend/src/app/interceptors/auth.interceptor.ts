import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../guards/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService); // Inject service to handle logout
  const token = localStorage.getItem('token');
  let req = request;
  /// Clone the request and add the Authorization header if the token exists
  if (token) {
    req = request.clone({
      // Clone the original request to add the new header
      setHeaders: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header for all outgoing requests
      },
    });
  }

  // 2. Handle the Response & Errors (New Graceful Handling)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // This is where "Unauthorized" is handled gracefully
        console.error('Session expired or unauthorized. Redirecting to login...');

        // Clean up signals, localStorage, and navigate to login
        authService.logout();
      }

      // Pass the error back to the component in case it needs to show a specific message
      return throwError(() => error);
    }),
  );
};
