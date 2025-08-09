import { Injectable, inject } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { Observable, map, take, tap, filter, switchMap } from 'rxjs';
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
    return this.authService.loading$.pipe(
      // Wait until loading is complete
      tap((loading: boolean) => {
        if (loading) {
          console.log('Authentication state is still loading...');
        }
      }),
      // Only proceed when loading is false
      filter((loading: boolean) => !loading),
      // Then check if user is authenticated
      switchMap(() => this.authService.isAuthenticated$),
      take(1),
      tap((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          console.log('Access denied - redirecting to login');
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: url }
          });
        } else {
          console.log('Authentication successful');
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
    return this.authService.loading$.pipe(
      // Wait until loading is complete
      filter((loading: boolean) => !loading),
      // Then check email verification
      switchMap(() => this.authService.user$),
      take(1),
      map((user) => {
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
    return this.authService.loading$.pipe(
      // Wait until loading is complete
      filter((loading: boolean) => !loading),
      // Then check if user is authenticated
      switchMap(() => this.authService.isAuthenticated$),
      take(1),
      tap((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          console.log('User already authenticated - redirecting to dashboard');
          this.router.navigate(['/portal']);
        }
      }),
      map((isAuthenticated: boolean) => !isAuthenticated)
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
    
    return this.authService.loading$.pipe(
      // Wait until loading is complete
      filter((loading: boolean) => !loading),
      // Then check user role
      switchMap(() => this.authService.user$),
      take(1),
      map((user) => {
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
  ): Observable<boolean> {
    return this.checkRoleComplete(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkRoleComplete(state.url);
  }

  private checkRoleComplete(url: string): Observable<boolean> {
    return this.authService.loading$.pipe(
      // Wait until loading is complete
      filter((loading: boolean) => !loading),
      // Then check role completion
      switchMap(() => this.authService.user$),
      take(1),
      switchMap(async (currentUser) => {
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

        // Skip setup check for the mentor setup page itself
        if (url.includes('/portal/mentor-setup')) {
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

        // Check if mentor user needs to complete setup
        const isFirstTimeLogin = await this.authService.getFirstTimeLoginStatus();
        if (isFirstTimeLogin && currentUser.userRole === 'mentor') {
          console.log('First-time mentor needs to complete setup');
          this.router.navigate(['/portal/mentor-setup'], { 
            queryParams: { returnUrl: url }
          });
          return false;
        }

        return true;
      })
    );
  }
}
