import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="padding: 50px; text-align: center;">
      <h2>Task Vault Login</h2>
      <input [(ngModel)]="username" placeholder="Username" /><br><br>
      <input [(ngModel)]="password" type="password" placeholder="Password" /><br><br>
      <button (click)="handleLogin()">Login</button>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  authService = inject(AuthService);
  router = inject(Router);

  handleLogin() {
  this.authService.login({ username: this.username, password: this.password })
    .subscribe({
      next: (res) => {
        console.log('Login successful!', res);
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        alert('Login failed! Check console.');
        console.error(err);
      }
    });
}
}