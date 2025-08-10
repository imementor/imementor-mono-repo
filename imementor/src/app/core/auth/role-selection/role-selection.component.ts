import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AuthError } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <h1>IMementor</h1>
          </div>
          <h2>Complete Your Profile</h2>
          <p>Please select your role to continue</p>
        </div>

        <div class="role-selection-form">
          <!-- Role Selection -->
          <div class="form-group">
            <label>I am a:</label>
            <div class="role-options">
              <button 
                type="button"
                class="role-option"
                [class.selected]="selectedRole() === 'mentee'"
                (click)="selectRole('mentee')"
                [disabled]="isLoading()">
                <div class="role-card">
                  <div class="role-icon">🎓</div>
                  <div class="role-content">
                    <h3>Mentee</h3>
                    <p>I'm looking for guidance and mentorship to grow in my career</p>
                  </div>
                </div>
              </button>
              
              <button 
                type="button"
                class="role-option"
                [class.selected]="selectedRole() === 'mentor'"
                (click)="selectRole('mentor')"
                [disabled]="isLoading()">
                <div class="role-card">
                  <div class="role-icon">👨‍🏫</div>
                  <div class="role-content">
                    <h3>Mentor</h3>
                    <p>I want to share my experience and help others succeed</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div class="auth-error" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <!-- Continue Button -->
          <button 
            type="button" 
            class="submit-btn"
            [disabled]="!selectedRole() || isLoading()"
            (click)="onContinue()">
            <span *ngIf="isLoading()" class="loading-spinner">⏳</span>
            {{ isLoading() ? 'Saving...' : 'Continue' }}
          </button>

          <!-- Sign Out Option -->
          <div class="auth-footer">
            <button 
              type="button" 
              class="text-btn"
              (click)="signOut()"
              [disabled]="isLoading()">
              Sign out and try again
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './role-selection.component.scss'
})
export class RoleSelectionComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  selectedRole = signal<'mentor' | 'mentee' | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');
  
  returnUrl = '/portal';

  ngOnInit() {
    // Get return url from route parameters or default to '/portal'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/portal';
  }

  selectRole(role: 'mentor' | 'mentee') {
    this.selectedRole.set(role);
    this.errorMessage.set('');
  }

  onContinue() {
    const role = this.selectedRole();
    if (!role) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.updateUserRole(role)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Role updated successfully');
          // Navigate to the return URL or portal/dashboard
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error: AuthError) => {
          this.errorMessage.set(error.message);
          console.error('Role update error:', error);
        }
      });
  }

  signOut() {
    this.authService.signOutAndRedirect();
  }
}
