import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
// The AuthService is responsible for handling user authentication, including login, logout, and registration. It manages the JWT token and user role using Angular's signal system, allowing components to reactively update based on authentication status.
export class AuthService {
  private http = inject(HttpClient);
  private token = signal<string | null>(localStorage.getItem('token'));
  private apiUrl = 'http://localhost:3000/auth/login';
  private router = inject(Router);

  // This will now be populated on login or refresh
  userRole = signal<string | null>(this.getRoleFromStoredToken());

  login(credentials: { username: string; password: string }) {
    // CRITICAL: You must return the observable here
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap((response) => {
        const token = response.access_token;
        localStorage.setItem('token', token);
        this.token.set(token);

        // Decode the token to extract the role and store it in a signal
        const decodedToken: any = jwtDecode(token);
        this.userRole.set(decodedToken.role);
      }),
    );
  }

  private getRoleFromStoredToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  isLoggedIn() {
    return !!this.token();
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.userRole.set(null);

    // redirect to login page after logout
    this.router.navigate(['/login']).then(() => {
      // small delay to ensure the navigation happens before the page reloads
      console.log('Navigated to login page, now reloading...');
    });
  }

  register(userData: any) {
    // 1. Define the URL where your NestJS server is listening
    const registerUrl = 'http://localhost:3000/auth/register';

    // 2. Perform the POST request
    // We send 'userData' which contains {username, password, role} from our form
    return this.http.post<any>(registerUrl, userData).pipe(
      tap((response) => {
        // Logic: Usually, we don't log in automatically after registration.
        // We just log the success and let the component handle the redirect.
        console.log('User registered successfully in NestJS', response);
      }),
    );
  }
}
