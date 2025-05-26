import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserResponse} from '../../keycloak/services/auth.service';
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  getUserPhotoUrl() {
    const photoId = 'entrenaSyncLogo_cpm2vo';
    return this.http.get<{ secure_url: string }>(`${this.apiUrl}/storage/images/${photoId}`);
  }

  getUsers(page: number = 0, size: number = 10): Observable<PagedResponse<UserResponse>> {
    return this.http.get<PagedResponse<UserResponse>>(`${this.apiUrl}/keycloak/user?page=${page}&size=${size}`, { withCredentials: true });
  }

}
