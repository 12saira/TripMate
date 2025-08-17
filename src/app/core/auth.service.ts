import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly tokenKey = 'authToken';
  private loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  // Register a new user as SuperAdmin or Visitor
  register(userType: 'superAdmin' | 'visitor', name: string, email: string, password: string): Observable<any> {
    const url = `${environment.API_URL}/auth/register`;
    const body = { name, email, password };
    const params = new HttpParams().set('userType', userType);
    return this.http.post(url, body, { params });
  }

  // Login a user
  login(userType: 'superAdmin' | 'visitor', email: string, password: string): Observable<boolean> {
    const url = `${environment.API_URL}/auth/login`;
    const body = { email, password };
    const params = new HttpParams().set('userType', userType);

    return this.http.post<{ token?: string }>(url, body, { params }).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.loggedInSubject.next(true); 
        }
      }),
      map(response => !!response.token),
      catchError(() => {
        this.clearToken();
        this.loggedInSubject.next(false);
        return of(false);
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.loggedInSubject.next(false);  // Update login status
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
