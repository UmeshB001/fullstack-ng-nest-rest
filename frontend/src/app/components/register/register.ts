import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../guards/auth.service';

@Component({
  selector: 'app-register', // HTML tag to use this component
  standalone: true, // This allows the component to be used without being declared in an NgModule
  imports: [FormsModule, RouterLink], // Import FormsModule for ngModel and RouterLink for navigation
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  // inject () : More concise way to inject services direclty without constructor
  private authService = inject(AuthService);
  private router = inject(Router);

  // signal (): A reactive state management primitive in Angular. It allows you to create reactive variables that automatically update the UI when their values change.
  isSubmitting = signal(false); // Tracks if the API call is in progress
  errorMessage = signal<string | null>(null); // Stores error messages to display in the UI

  handleRegister(formData: any) {
    this.isSubmitting.set(true); // Set submitting state to true when the form is submitted
    this.errorMessage.set(null); // Clear any previous error messages
    // .subscribe(): Starts the "lazy" Observable (the network request) and allows you to handle the response or errors when they arrive.
    this.authService.register(formData).subscribe({
      next: () => {
        alert('Registration successful! Please log in.'); // Show success message
        this.router.navigate(['/login']); // Navigate to login page on successful registration
      },
      error: (err: any) => {
        // Safe access: err?.error?.message ensures it doesn't crash if objects are missing
        this.errorMessage.set(err?.error?.message || 'Registration failed. Is the server running?');
        this.isSubmitting.set(false);
      },
    });
  }
}
