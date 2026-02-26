import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

// This guard checks if the user is authenticated before allowing access to certain routes (like the task list). If the user is not logged in, it redirects them to the login page.
export const authGuard = () => {
  // Inject the AuthService and Router to check authentication status and handle redirection
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in using the AuthService. If they are, allow access to the route. If not, redirect to the login page.
  if (authService.isLoggedIn()) {
    // If the user is authenticated, return true to allow access to the route
    return true;
  } else {
    // If the user is not authenticated, return a UrlTree that redirects to the login page. This is the recommended way to handle redirection in guards.
    return router.createUrlTree(['/login']);
  }
};
