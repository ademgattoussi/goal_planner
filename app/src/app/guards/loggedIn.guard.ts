import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // List of routes that don't require authentication
    const publicRoutes = ['/login', '/signup'];
    
    // If route is public, allow access
    if (publicRoutes.includes(route.routeConfig?.path || '')) {
      return true;
    }

    // For protected routes, check authentication
    if (this.authService.isLoggedIn) {
      return true;
    }

    // Redirect to login if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}