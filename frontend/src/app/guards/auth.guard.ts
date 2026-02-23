import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    return true;
  }else {
    // Redirect to login if the user isn't authenticated
    return router.createUrlTree(['/login']);
  }
};