import { Routes } from '@angular/router';
import { AuthGuard } from './guards/loggedIn.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'goal-list',
        loadComponent: () =>
          import('./pages/goal-list/goal-list.component').then(
            (m) => m.GoalListComponent
          ),
      },
      {
        path: 'new-goal',
        loadComponent: () =>
          import('./pages/new-goal/new-goal.component').then(
            (m) => m.NewGoalComponent
          ),
      },
      {
        path: 'task-list',
        loadComponent: () =>
          import('./pages/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' },
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
