import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/register').then(m => m.Register)
  },
  {
    path: 'homepage',
    loadComponent: () => import('./portal/homepage/homepage').then(m => m.Homepage)
  },
  {
    path: 'mentor-setup',
    loadComponent: () => import('./portal/mentor-setup/mentor-setup').then(m => m.MentorSetup)
  },
  {
    path: 'dashboard',
    redirectTo: '/homepage',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
