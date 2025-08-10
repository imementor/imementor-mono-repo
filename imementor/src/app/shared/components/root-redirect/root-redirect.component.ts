import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f8fafc;
    }

    .loading-spinner {
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    p {
      color: #64748b;
      font-size: 16px;
      margin: 0;
    }
  `]
})
export class RootRedirectComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = true;

  ngOnInit() {
    // Wait for auth state to be loaded, then redirect accordingly
    this.authService.loading$.pipe(
      filter((loading: boolean) => !loading),
      take(1)
    ).subscribe(() => {
      this.checkAuthAndRedirect();
    });
  }

  private checkAuthAndRedirect() {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        if(this.router.url !== '/') {
            // User is authenticated, redirect to portal
            console.log('User authenticated, redirecting to portal');
            this.router.navigateByUrl('/portal', { replaceUrl: true });
        }
      } else {
        // User is not authenticated, redirect to landing page
        console.log('User not authenticated, redirecting to landing page');
        this.router.navigateByUrl('/landing', { replaceUrl: true });
      }
      this.isLoading = false;
    });
  }
}
