import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http = inject(HttpClient);

  constructor(@Inject('API_BASE_URL') private _baseUrl: string) {}

  validationOnlyHeader = new HttpHeaders().set('x-validate-only', '');

  get<T>(
    resource: string,
    params: HttpParams = new HttpParams()
  ): Observable<T> {
    return this._http.get<T>(`${this._baseUrl}/${resource}`, {
      params,
      observe: 'body',
    });
  }

  post<T, R = T>(
    resource: string,
    params?: R,
    options: any = {}
  ): Observable<T> {
    return this._http.post<T>(`${this._baseUrl}/${resource}`, params);
  }

  put<T>(resource: string, params?: T, options: any = {}): Observable<T> {
    return this._http.put<T>(`${this._baseUrl}/${resource}`, params);
  }

  patch<T>(resource: string, params?: T, options: any = {}): Observable<T> {
    return this._http.patch<T>(`${this._baseUrl}/${resource}`, params);
  }

  delete<T>(
    resource: string,
    params: HttpParams = new HttpParams()
  ): Observable<T> {
    return this._http.delete<T>(`${this._baseUrl}/${resource}`, {
      params,
      observe: 'body',
    });
  }
}
