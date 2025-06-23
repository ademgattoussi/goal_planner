import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  map,
  catchError,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { endpoints } from '../../environments/endpoints';
import {
  LoginRequest,
  AuthResponse,
  RegisterRequest,
} from '../interfaces/auth.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AuthError,
  EmailInUseError,
  NetworkError,
  ValidationError,
  InvalidCredentialsError,
} from './auth-errors.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private userSubject = new BehaviorSubject<User | null>(null);

  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'token';
  private readonly TOKEN_EXPIRATION_KEY = 'token_expiration';
  private readonly TOKEN_DURATION_DAYS = 7;

  initializeAuthState(): void {
    const token = this.token;
    const userJson = localStorage.getItem(this.USER_KEY);
    const expiration = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);

    try {
      if (token && userJson && expiration) {
        const user = new User(JSON.parse(userJson));
        const expirationDate = new Date(expiration);
        const now = new Date();

        if (expirationDate > now) {
          this.userSubject.next(user);
          return;
        }
      }
    } catch (e) {
      console.error('Auth initialization error:', e);
    }

    this.clearAuthData();
  }

  get currentUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(data: any): Observable<User> {
    return this.apiService
      .post<AuthResponse, LoginRequest>(endpoints.auth.login, data)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        map((response) => new User(response.user)),
        catchError((error: HttpErrorResponse) =>
          this.handleAuthError(error, 'Login failed')
        )
      );
  }

  register(
    fullname: string,
    email: string,
    password: string,
    mobile: string
  ): Observable<User> {
    if (!fullname || !email || !password || !mobile) {
      return throwError(
        () =>
          new ValidationError({
            fullname: fullname ? [] : ['fullname is required'],
            email: email ? [] : ['Email is required'],
            password: password ? [] : ['Password is required'],
            mobile: mobile ? [] : ['mobile is required'],
          })
      );
    }

    return this.apiService
      .post<AuthResponse, RegisterRequest>(endpoints.auth.register, {
        fullname,
        email,
        password,
        mobile,
      })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        map((response) => new User(response.user)),
        catchError((error: HttpErrorResponse) =>
          this.handleAuthError(error, 'Registration failed')
        )
      );
  }

  private handleAuthResponse(response: AuthResponse): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.TOKEN_DURATION_DAYS);

    const user = new User(response.user);

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(
      this.TOKEN_EXPIRATION_KEY,
      expirationDate.toISOString()
    );

    this.userSubject.next(user);
  }

  private handleAuthError(error: HttpErrorResponse, defaultMessage: string) {
    this.clearAuthData();

    if (error.status === 0) {
      return throwError(() => new NetworkError());
    } else if (error.status === 401) {
      return throwError(() => new InvalidCredentialsError());
    } else if (error.status === 409) {
      return throwError(() => new EmailInUseError());
    } else if (error.status === 422) {
      return throwError(() => new ValidationError(error.error.errors));
    }

    return throwError(
      () =>
        new AuthError(
          error.message || defaultMessage,
          'An unexpected error occurred. Please try again.'
        )
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  clearAuthData(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    this.userSubject.next(null);
  }
}
