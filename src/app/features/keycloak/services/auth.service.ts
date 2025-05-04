import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  session_state: string;
  scope: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:80/session/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body: LoginRequest = { username, password };
    return this.http.post<any>(this.apiUrl, body);
  }
}
