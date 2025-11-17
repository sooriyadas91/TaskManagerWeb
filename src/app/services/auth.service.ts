import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private credentials: AuthCredentials | null = null;
  private user: AuthUser | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthUser>(`${environment.apiBaseUrl}/api/Auth/login`, { username, password }).pipe(
      map(response => {
        if (response && response.id && response.username) {
          this.loggedIn$.next(true);
          this.credentials = { username, password };
          this.user = response;
          return true;
        } else {
          this.loggedIn$.next(false);
          this.credentials = null;
          this.user = null;
          return false;
        }
      }),
      catchError(() => {
        this.loggedIn$.next(false);
        this.credentials = null;
        this.user = null;
        return of(false);
      })
    );
  }

  logout(): void {
    this.loggedIn$.next(false);
    this.credentials = null;
    this.user = null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getCredentials(): AuthCredentials | null {
    return this.credentials;
  }

  getUser(): AuthUser | null {
    return this.user;
  }
}
