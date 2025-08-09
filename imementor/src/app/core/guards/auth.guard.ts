import { Injectable, inject } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('Access denied - redirecting to login');
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: url }
          });
        }
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerifiedGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkEmailVerified(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkEmailVerified(state.url);
  }

  private checkEmailVerified(url: string): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: url }
          });
          return false;
        }

        if (!user.emailVerified) {
          this.router.navigate(['/auth/verify-email'], { 
            queryParams: { returnUrl: url }
          });
          return false;
        }

        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => {
        if (isAuthenticated) {
          console.log('User already authenticated - redirecting to dashboard');
          this.router.navigate(['/portal']);
        }
      }),
      map(isAuthenticated => !isAuthenticated)
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRole = route.data?.['role'] as 'mentor' | 'mentee';
    
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        
        if (requiredRole && user.userRole !== requiredRole) {
          // Redirect to appropriate dashboard based on user's actual role
          if (user.userRole === 'mentor') {
            this.router.navigate(['/mentor-dashboard']);
          } else if (user.userRole === 'mentee') {
            this.router.navigate(['/mentee-dashboard']);
          } else {
            this.router.navigate(['/portal']);
          }
          return false;
        }
        
        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleCompleteGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkRoleComplete(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkRoleComplete(state.url);
  }

  private async checkRoleComplete(url: string): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: url }
      });
      return false;
    }

    // Skip role check for the role selection page itself
    if (url.includes('/auth/role-selection')) {
      return true;
    }

    const needsRoleSelection = await this.authService.userNeedsRoleSelection();
    if (needsRoleSelection) {
      console.log('User needs to complete role selection');
      this.router.navigate(['/auth/role-selection'], { 
        queryParams: { returnUrl: url }
      });
      return false;
    }

    return true;
  }
}
