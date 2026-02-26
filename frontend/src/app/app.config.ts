import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])), // <--- Register the auth interceptor for attaching JWT tokens to requests
    provideBrowserGlobalErrorListeners(), // <--- Optional: Global error handling for better debugging
    provideRouter(routes), // <--- Register the router with our routes
  ],
};
