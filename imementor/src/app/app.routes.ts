import { Route } from '@angular/router';
import { AuthGuard, EmailVerifiedGuard, GuestGuard, RoleCompleteGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  // Authentication routes (accessible only to non-authenticated users)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'signup',
        loadComponent: () => import('./core/auth/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./core/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./core/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'role-selection',
        loadComponent: () => import('./core/auth/role-selection/role-selection.component').then(m => m.RoleSelectionComponent),
        canActivate: [AuthGuard]
      }
    ]
  },
  
  // Legacy auth routes (redirect to new structure)
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: '/auth/signup',
    pathMatch: 'full'
  },
  
  // Portal routes (require authentication and complete role)
  {
    path: 'portal',
    loadComponent: () => import('./portal/portal.component').then(m => m.PortalComponent),
    canActivate: [AuthGuard, RoleCompleteGuard],
    children: [
      {
        path: 'mentor-setup',
        loadComponent: () => import('./portal/mentor-setup/mentor-setup.component').then(m => m.MentorSetupComponent),
        canActivate: [AuthGuard] // Only authenticated users, no RoleCompleteGuard here since it's for setup
      },
      {
        path: 'homepage',
        loadComponent: () => import('./portal/homepage/homepage').then(m => m.Homepage)
      },
      {
        path: 'learning-portal',
        loadComponent: () => import('./portal/learning-portal/learning-portal.component').then(m => m.LearningPortalComponent)
      },
      {
        path: 'mentors-search',
        loadComponent: () => import('./portal/mentors-search/mentors-search.component').then(m => m.MentorsSearchComponent)
      },
      {
        path: 'live-classes',
        loadComponent: () => import('./portal/live-classes/live-classes.component').then(m => m.LiveClassesComponent)
      },
      {
        path: 'live-class-management',
        loadComponent: () => import('./portal/live-class-management/live-class-management.component').then(m => m.LiveClassManagementComponent)
      },
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      }
    ]
  },

  // Default route - smart redirect based on auth status
  {
    path: '',
    loadComponent: () => import('./shared/components/root-redirect/root-redirect.component').then(m => m.RootRedirectComponent),
    pathMatch: 'full'
  },

  // Landing page (public - for unauthenticated users only)
  {
    path: 'landing',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent),
    canActivate: [GuestGuard]
  },
  
  // Wildcard route (404 page)
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
