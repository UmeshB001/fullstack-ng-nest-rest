import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private token = signal<string | null>(localStorage.getItem('token'));
  private apiUrl = 'http://localhost:3000/auth/login';


 login(credentials: { username: string; password: string }) {
  // CRITICAL: You must return the observable here
  return this.http.post<any>(this.apiUrl, credentials).pipe(
    tap((response) => {
      localStorage.setItem('token', response.access_token);
      this.token.set(response.access_token);
    })
  );
}

  isLoggedIn() {
    return !!this.token();
  }
}


