import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthError } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="forgot-icon">🔒</div>
          <h2>Reset Password</h2>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="auth-form" *ngIf="!emailSent()">
          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="form-control"
              [class.error]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
              placeholder="Enter your email address">
            <div class="error-message" *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched">
              <span *ngIf="forgotPasswordForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="forgotPasswordForm.get('email')?.errors?.['email']">Please enter a valid email</span>
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
            [disabled]="forgotPasswordForm.invalid || isLoading()">
            <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
            {{ isLoading() ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <!-- Success message -->
        <div class="success-content" *ngIf="emailSent()">
          <div class="auth-success">
            <span class="success-icon">✅</span>
            <h3>Reset Link Sent!</h3>
            <p>We've sent a password reset link to <strong>{{ emailAddress() }}</strong></p>
            <p>Please check your email and follow the instructions to reset your password.</p>
          </div>

          <div class="help-info">
            <h4>Didn't receive the email?</h4>
            <ul>
              <li>Check your spam or junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <button 
            type="button" 
            class="resend-btn"
            (click)="resendResetEmail()"
            [disabled]="isLoading() || cooldownActive()">
            <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
            <span *ngIf="!cooldownActive() && !isLoading()">Send Again</span>
            <span *ngIf="cooldownActive() && !isLoading()">
              Send Again in {{ cooldownTime() }}s
            </span>
          </button>
        </div>

        <!-- Back to Login -->
        <div class="auth-footer">
          <p>Remember your password? 
            <a routerLink="/auth/login" class="auth-link">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals
  isLoading = signal(false);
  errorMessage = signal('');
  emailSent = signal(false);
  emailAddress = signal('');
  cooldownActive = signal(false);
  cooldownTime = signal(0);

  forgotPasswordForm: FormGroup;
  private cooldownTimer: any;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.sendResetEmail();
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }

  sendResetEmail() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const email = this.forgotPasswordForm.value.email;
    
    this.authService.sendPasswordResetEmail(email)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.emailSent.set(true);
          this.emailAddress.set(email);
          this.startCooldown();
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Reset password error:', error);
        }
      });
  }

  resendResetEmail() {
    this.sendResetEmail();
  }

  private startCooldown() {
    this.cooldownActive.set(true);
    this.cooldownTime.set(60); // 60 seconds cooldown

    this.cooldownTimer = setInterval(() => {
      const currentTime = this.cooldownTime() - 1;
      this.cooldownTime.set(currentTime);

      if (currentTime <= 0) {
        this.cooldownActive.set(false);
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }
}
