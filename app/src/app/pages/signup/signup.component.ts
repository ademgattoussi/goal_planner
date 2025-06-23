import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  isLoading = false;
  fb = new FormBuilder();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  signupForm = this.fb.group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    mobile: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.signupForm.invalid || this.isLoading) return;

    this.isLoading = true;

    const { fullname, email, password, mobile } = this.signupForm.value;

    this.authService.register(fullname!, email!, password!, mobile!).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 4000
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const message = err?.error?.message || 'Registration failed';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
