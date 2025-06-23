import { ApplicationConfig, Inject, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { environment } from '../environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: 'API_BASE_URL', useValue: environment.api.host },
    provideAnimations(),
  ],
};