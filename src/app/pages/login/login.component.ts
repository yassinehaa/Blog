import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container page-container fade-in">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card">
            <div class="card-header bg-primary-color text-white">
              <h3 class="mb-0">Login</h3>
            </div>
            <div class="card-body">
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    placeholder="Enter your email"
                  >
                  <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-danger">
                    Please enter a valid email
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    placeholder="Enter your password"
                  >
                  <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-danger">
                    Password is required
                  </div>
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || isSubmitting"
                  >
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Login
                  </button>
                </div>
              </form>

          </div>
        </div>
      </div>
    </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: error => {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.isSubmitting = false;
      }
    });
  }

}
