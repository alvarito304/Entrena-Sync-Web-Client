// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {catchError, map, Observable, of, shareReplay, switchMap} from 'rxjs';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string
}
export interface ClientRequest {
  name: string;
  address: string;
  avatar?: string ;
  phone: string;
  birthDate: string;
  gender: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userInfo$: Observable<UserResponse | null> | undefined;
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/session/login`, { username: email, password: password }, {
      headers: {
        'content-type' : 'application/json'
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }

  register(userRequest: UserRequest, clientRequest: ClientRequest): Observable<any> {
    console.log('Registering user:', userRequest);
    return this.http.post<{ id: string }>(`${this.apiUrl}/keycloak/user`, userRequest).pipe(
      switchMap((response) => {
        const keycloakUserId = response.id;

        const fullClientRequest = {
          ...clientRequest,
          userId: keycloakUserId
        };
        console.log("full client:", fullClientRequest)

        return this.http.post(`${this.apiUrl}/Clients`, fullClientRequest).pipe(
          switchMap(() =>
            this.login(userRequest.email, userRequest.password)
          )
        );
      })
    );
  }

  getUserInfo(): Observable<UserResponse | null> {
    if (!this.userInfo$) {
      this.userInfo$ = this.http.get<UserResponse>(`${this.apiUrl}/session/me`, { withCredentials: true }).pipe(
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

