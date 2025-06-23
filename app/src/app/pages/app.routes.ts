import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/loggedIn.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '/home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: '/goal-list',
        loadComponent: () => import('./goal-list/goal-list.component').then(m => m.GoalListComponent)
      },
      {
        path: 'task-list',
        loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent)
      },
      {
        path: 'reminders',
        loadComponent: () => import('./reminders/reminders.component').then(m => m.RemindersComponent)
      },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
