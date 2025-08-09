import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService, AuthError } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <!-- Redirecting Screen -->
      <div class="auth-card" *ngIf="isRedirecting()">
        <div class="redirecting-content">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <h2>Login Successful!</h2>
          <p>Redirecting you to your dashboard...</p>
        </div>
      </div>

      <!-- Login Form -->
      <div class="auth-card" *ngIf="!isRedirecting()">
        <div class="auth-header">
          <div class="logo">
            <h1>iMentor</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Role Selection -->
          <div class="form-group role-selection">
            <label>Sign in as:</label>
            <div class="role-options">
              <label class="role-option">
                <input 
                  type="radio" 
                  formControlName="userRole" 
                  value="mentee"
                  class="role-radio">
                <div class="role-card">
                  <div class="role-icon">🎓</div>
                  <span>Mentee</span>
                </div>
              </label>
              
              <label class="role-option">
                <input 
                  type="radio" 
                  formControlName="userRole" 
                  value="mentor"
                  class="role-radio">
                <div class="role-card">
                  <div class="role-icon">👨‍🏫</div>
                  <span>Mentor</span>
                </div>
              </label>
            </div>
            <div class="error-message" *ngIf="loginForm.get('userRole')?.invalid && loginForm.get('userRole')?.touched">
              <span *ngIf="loginForm.get('userRole')?.errors?.['required']">Please select your role</span>
            </div>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="form-control"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Enter your email">
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input 
                [type]="showPassword() ? 'text' : 'password'"
                id="password" 
                formControlName="password"
                class="form-control"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Enter your password">
              <button 
                type="button" 
                class="password-toggle"
                (click)="togglePasswordVisibility()">
                {{ showPassword() ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe">
              <span class="checkmark"></span>
              Remember me
            </label>
            <a routerLink="/auth/forgot-password" class="forgot-password-link">
              Forgot Password?
            </a>
          </div>

          <!-- Error Message -->
          <div class="auth-error" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="submit-btn"
            [disabled]="loginForm.invalid || isLoading()">
            <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
            {{ isLoading() ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>Or continue with</span>
        </div>

        <!-- Social Login Buttons -->
        <div class="social-login">
          <button 
            type="button" 
            class="social-btn google-btn"
            (click)="signInWithGoogle()"
            [disabled]="isLoading()">
            <span class="social-icon">🔍</span>
            Google
          </button>
          
          <button 
            type="button" 
            class="social-btn facebook-btn"
            (click)="signInWithFacebook()"
            [disabled]="isLoading()">
            <span class="social-icon">📘</span>
            Facebook
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="auth-footer">
          <p>Don't have an account? 
            <a routerLink="/auth/signup" class="auth-link">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
  styles: [`
    .redirecting-content {
      text-align: center;
      padding: 3rem 2rem;
    }

    .redirecting-content .loading-spinner {
      margin-bottom: 2rem;
    }

    .redirecting-content .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .redirecting-content h2 {
      color: #059669;
      margin: 1rem 0;
      font-size: 1.5rem;
    }

    .redirecting-content p {
      color: #64748b;
      font-size: 1rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  isRedirecting = signal(false);

  loginForm: FormGroup;
  returnUrl = '/portal';

  constructor() {
    this.loginForm = this.fb.group({
      userRole: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/portal'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/portal';
    
    // Clear any previous error messages
    this.errorMessage.set('');
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      const { userRole, email, password } = this.loginForm.value;
      
      this.authService.signIn({ userRole, email, password })
        .pipe(
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: async () => {
            console.log('Login successful');
            this.isRedirecting.set(true);
            
            // Add a small delay to show the success message
            setTimeout(async () => {
              // Check if first-time mentor needs setup
              const isFirstTime = await this.authService.getFirstTimeLoginStatus();
              const currentUser = this.authService.getCurrentUser();
              
              if (isFirstTime && currentUser?.userRole === 'mentor') {
                this.router.navigateByUrl('/portal/mentor-setup');
              } else {
                this.router.navigateByUrl(this.returnUrl);
              }
            }, 1500);
          },
          error: (error: AuthError) => {
            this.errorMessage.set(error.message);
            console.error('Login error:', error);
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  signInWithGoogle() {
    // Check if user has selected a role for consistency
    const selectedRole = this.loginForm.get('userRole')?.value;
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.authService.signInWithGoogle(selectedRole)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: async () => {
          console.log('Google login successful');
          this.isRedirecting.set(true);
          
          // Add a small delay to show the success message
          setTimeout(async () => {
            // Check if user needs to set their role
            const needsRole = await this.authService.userNeedsRoleSelection();
            if (needsRole) {
              this.router.navigateByUrl('/auth/role-selection');
            } else {
              // Check if first-time mentor needs setup
              const isFirstTime = await this.authService.getFirstTimeLoginStatus();
              const currentUser = this.authService.getCurrentUser();
              
              if (isFirstTime && currentUser?.userRole === 'mentor') {
                this.router.navigateByUrl('/portal/mentor-setup');
              } else {
                this.router.navigateByUrl(this.returnUrl);
              }
            }
          }, 1500);
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Google login error:', error);
        }
      });
  }

  signInWithFacebook() {
    // Check if user has selected a role for consistency
    const selectedRole = this.loginForm.get('userRole')?.value;
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.authService.signInWithFacebook(selectedRole)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: async () => {
          console.log('Facebook login successful');
          this.isRedirecting.set(true);
          
          // Add a small delay to show the success message
          setTimeout(async () => {
            // Check if user needs to set their role
            const needsRole = await this.authService.userNeedsRoleSelection();
            if (needsRole) {
              this.router.navigateByUrl('/auth/role-selection');
            } else {
              // Check if first-time mentor needs setup
              const isFirstTime = await this.authService.getFirstTimeLoginStatus();
              const currentUser = this.authService.getCurrentUser();
              
              if (isFirstTime && currentUser?.userRole === 'mentor') {
                this.router.navigateByUrl('/portal/mentor-setup');
              } else {
                this.router.navigateByUrl(this.returnUrl);
              }
            }
          }, 1500);
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Facebook login error:', error);
        }
      });
  }
}
