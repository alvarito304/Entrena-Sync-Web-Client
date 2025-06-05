// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, catchError, map, Observable, of, shareReplay, switchMap, throwError, tap} from 'rxjs';
import {ClientCreateRequest, ClientResponse} from '../../../core/models/clients/clients-interfaces';
import {ClientService} from '../../clients/service/clients.service';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  roles: string[];
}

export interface UserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string
  type: string
  roles?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userInfo$: Observable<UserResponse | null> | undefined;
  constructor(private http: HttpClient, private router: Router, private clientService: ClientService) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/session/login`, { username: email, password }, {
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      map(res => {
        this.userInfo$ = undefined;
        return res;
      })
    );
  }


  logout() {
    console.log('Cerrando sesión');
    this.http.post(`${this.apiUrl}/session/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log('Logout exitoso');
        if (this.router.url === '/' || this.router.url === '') {
          location.reload();
        } else {
          this.router.navigate(['']);
        }
      },
      error: (err) => {
        console.error('Error en logout:', err);
      }
    });
  }


  register(userRequest: UserRequest, clientRequest: ClientCreateRequest): Observable<any> {
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
        tap(user => console.log('[AuthService] Usuario cargado en getUserInfo:', user)),
        catchError(err => {
          console.warn('[AuthService] Error en getUserInfo:', err);
          return of(null);
        }),
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

  getAuthClient():Observable<ClientResponse>{
    return this.getUserInfo().pipe(
      switchMap((user) => {
        if (user && user.id) {
          return this.clientService.getClientByUserId(user.id);
        } else {
          throw new Error('User not authenticated');
        }
      }),
      catchError((err) => {
        console.error('Error fetching client:', err);
        return throwError(() => err);
      })
    );
  }
}

