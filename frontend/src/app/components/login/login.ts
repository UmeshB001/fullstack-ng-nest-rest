import { Component, inject, signal } from '@angular/core'; // Added signal
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../guards/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: 'login.html',
})
export class LoginComponent {
  username = '';
  password = '';

  // 1. Define the missing Signals for the UI
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  private authService = inject(AuthService);
  private router = inject(Router);

  handleLogin() {
    // 2. Start the loading state and clear old errors
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        console.log('Login successful!', res);
        // On success, navigate away
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        // 3. Update the UI with the error message from the backend
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        console.error(err);
      },
    });
  }
}
