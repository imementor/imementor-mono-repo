import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthError } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="verification-icon">📧</div>
          <h2>Verify Your Email</h2>
          <p *ngIf="userEmail()">
            We've sent a verification link to <strong>{{ userEmail() }}</strong>
          </p>
          <p>Please check your email and click the verification link to activate your account.</p>
        </div>

        <div class="verification-content">
          <!-- Success message -->
          <div class="success-message" *ngIf="emailSentMessage()">
            <span class="success-icon">✅</span>
            {{ emailSentMessage() }}
          </div>

          <!-- Error message -->
          <div class="error-message" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <!-- Action buttons -->
          <div class="action-buttons">
            <button 
              type="button" 
              class="resend-btn"
              (click)="resendVerificationEmail()"
              [disabled]="isLoading() || cooldownActive()">
              <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
              <span *ngIf="!cooldownActive() && !isLoading()">Resend Verification Email</span>
              <span *ngIf="cooldownActive() && !isLoading()">
                Resend in {{ cooldownTime() }}s
              </span>
            </button>

            <button 
              type="button" 
              class="secondary-btn"
              (click)="goToLogin()"
              [disabled]="isLoading()">
              Back to Login
            </button>
          </div>

          <!-- Additional help -->
          <div class="help-section">
            <h3>Didn't receive the email?</h3>
            <ul>
              <li>Check your spam or junk folder</li>
              <li>Make sure {{ userEmail() }} is correct</li>
              <li>Add our domain to your email whitelist</li>
              <li>Try resending the verification email</li>
            </ul>
            
            <p class="contact-support">
              Still having trouble? 
              <a href="mailto:support@imentor.com">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals
  isLoading = signal(false);
  errorMessage = signal('');
  emailSentMessage = signal('');
  userEmail = signal('');
  cooldownActive = signal(false);
  cooldownTime = signal(0);

  private cooldownTimer: any;

  ngOnInit() {
    // Get current user email
    this.authService.user$.subscribe(user => {
      if (user?.email) {
        this.userEmail.set(user.email);
      }
    });

    // Clear any previous messages
    this.errorMessage.set('');
    this.emailSentMessage.set('');
  }

  ngOnDestroy() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }

  resendVerificationEmail() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.emailSentMessage.set('');

    this.authService.sendEmailVerification()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.emailSentMessage.set('Verification email sent successfully!');
          this.startCooldown();
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Send verification email error:', error);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
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
