import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService, AuthError } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

// Custom validator for password confirmation
export function passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <h1>iMentor</h1>
          </div>
          <h2>Create Account</h2>
          <p>Join our community of mentors and learners</p>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- User Role Selection -->
          <div class="form-group role-selection">
            <label>I want to join as:</label>
            <div class="role-options">
              <label class="role-option">
                <input 
                  type="radio" 
                  formControlName="userRole" 
                  value="mentee"
                  class="role-radio">
                <div class="role-card">
                  <div class="role-icon">🎓</div>
                  <h3>Mentee</h3>
                  <p>Learn from experienced professionals</p>
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
                  <h3>Mentor</h3>
                  <p>Share your expertise and guide others</p>
                </div>
              </label>
            </div>
            <div class="error-message" *ngIf="signupForm.get('userRole')?.invalid && signupForm.get('userRole')?.touched">
              <span *ngIf="signupForm.get('userRole')?.errors?.['required']">Please select your role</span>
            </div>
          </div>

          <!-- Name Fields -->
          <div class="name-fields">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName"
                class="form-control"
                [class.error]="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched"
                placeholder="First name">
              <div class="error-message" *ngIf="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched">
                <span *ngIf="signupForm.get('firstName')?.errors?.['required']">First name is required</span>
                <span *ngIf="signupForm.get('firstName')?.errors?.['minlength']">Must be at least 2 characters</span>
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName"
                class="form-control"
                [class.error]="signupForm.get('lastName')?.invalid && signupForm.get('lastName')?.touched"
                placeholder="Last name">
              <div class="error-message" *ngIf="signupForm.get('lastName')?.invalid && signupForm.get('lastName')?.touched">
                <span *ngIf="signupForm.get('lastName')?.errors?.['required']">Last name is required</span>
                <span *ngIf="signupForm.get('lastName')?.errors?.['minlength']">Must be at least 2 characters</span>
              </div>
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
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
              placeholder="Enter your email">
            <div class="error-message" *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched">
              <span *ngIf="signupForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="signupForm.get('email')?.errors?.['email']">Please enter a valid email</span>
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
                [class.error]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
                placeholder="Create a strong password">
              <button 
                type="button" 
                class="password-toggle"
                (click)="togglePasswordVisibility()">
                {{ showPassword() ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div class="password-requirements" *ngIf="signupForm.get('password')?.touched">
              <small class="requirement" [class.valid]="passwordRequirements().minLength">
                ✓ At least 8 characters
              </small>
              <small class="requirement" [class.valid]="passwordRequirements().hasUppercase">
                ✓ One uppercase letter
              </small>
              <small class="requirement" [class.valid]="passwordRequirements().hasLowercase">
                ✓ One lowercase letter
              </small>
              <small class="requirement" [class.valid]="passwordRequirements().hasNumber">
                ✓ One number
              </small>
            </div>
            <div class="error-message" *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched">
              <span *ngIf="signupForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="signupForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters</span>
              <span *ngIf="signupForm.get('password')?.errors?.['pattern']">Password must contain uppercase, lowercase, and numbers</span>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password"
              id="confirmPassword" 
              formControlName="confirmPassword"
              class="form-control"
              [class.error]="(signupForm.get('confirmPassword')?.invalid || signupForm.errors?.['passwordMismatch']) && signupForm.get('confirmPassword')?.touched"
              placeholder="Confirm your password">
            <div class="error-message" *ngIf="(signupForm.get('confirmPassword')?.invalid || signupForm.errors?.['passwordMismatch']) && signupForm.get('confirmPassword')?.touched">
              <span *ngIf="signupForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="signupForm.errors?.['passwordMismatch']">Passwords do not match</span>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="acceptTerms">
              <span class="checkmark"></span>
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and 
              <a href="/privacy" target="_blank">Privacy Policy</a>
            </label>
            <div class="error-message" *ngIf="signupForm.get('acceptTerms')?.invalid && signupForm.get('acceptTerms')?.touched">
              <span *ngIf="signupForm.get('acceptTerms')?.errors?.['required']">You must accept the terms and conditions</span>
            </div>
          </div>

          <!-- Error Message -->
          <div class="auth-error" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="submit-btn"
            [disabled]="signupForm.invalid || isLoading()">
            <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
            {{ isLoading() ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>Or sign up with</span>
        </div>

        <!-- Social Login Buttons -->
        <div class="social-login">
          <button 
            type="button" 
            class="social-btn google-btn"
            (click)="signUpWithGoogle()"
            [disabled]="isLoading()">
            <span class="social-icon">🔍</span>
            Google
          </button>
          
          <button 
            type="button" 
            class="social-btn facebook-btn"
            (click)="signUpWithFacebook()"
            [disabled]="isLoading()">
            <span class="social-icon">📘</span>
            Facebook
          </button>
        </div>

        <!-- Sign In Link -->
        <div class="auth-footer">
          <p>Already have an account? 
            <a routerLink="/auth/login" class="auth-link">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  passwordRequirements = signal({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  });

  signupForm: FormGroup;
  returnUrl = '/portal';

  constructor() {
    this.signupForm = this.fb.group({
      userRole: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/portal'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/portal';
    
    // Clear any previous error messages
    this.errorMessage.set('');
    
    // Subscribe to password changes to update requirements
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordRequirements(password || '');
    });
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  updatePasswordRequirements(password: string) {
    this.passwordRequirements.set({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password)
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      const { userRole, email, password, firstName, lastName } = this.signupForm.value;
      
      this.authService.signUp({ userRole, email, password, firstName, lastName })
        .pipe(
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: () => {
            console.log('Signup successful');
            // Redirect to email verification page
            this.router.navigate(['/auth/verify-email']);
          },
          error: (error: AuthError) => {
            this.errorMessage.set(error.message);
            console.error('Signup error:', error);
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }

  signUpWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.authService.signInWithGoogle()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Google signup successful');
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Google signup error:', error);
        }
      });
  }

  signUpWithFacebook() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.authService.signInWithFacebook()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Facebook signup successful');
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Facebook signup error:', error);
        }
      });
  }
}
