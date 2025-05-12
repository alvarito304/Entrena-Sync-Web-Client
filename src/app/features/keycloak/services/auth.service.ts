// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable, of, shareReplay} from 'rxjs';

export interface UserResponse {
  sub: string;
  username: string;
  email: string;
  given_name: string;
  family_name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userInfo$: Observable<UserResponse | null> | undefined;
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string ) {
    return this.http.post(`${this.apiUrl}/session/login`,
    {
      username,
        password
    },{
      withCredentials: true,
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }

  getUserInfo(): Observable<UserResponse | null> {
    if (!this.userInfo$) {
      this.userInfo$ = this.http.get<UserResponse>('/session/me', { withCredentials: true }).pipe(
        catchError((_) => of(null)),
        shareReplay(1)
      );
    }
    return this.userInfo$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.getUserInfo().pipe(map(user => !!user && !!user.username));
  }

  hasRole(role: string): Observable<boolean> {
    return this.getUserInfo().pipe(map(user => {
      return !!user && Array.isArray((user as any).roles) && (user as any).roles.includes(role);
    }));
  }
}

