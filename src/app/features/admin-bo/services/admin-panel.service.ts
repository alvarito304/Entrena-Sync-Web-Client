import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserResponse} from '../../keycloak/services/auth.service';
import {ClientResponse} from '../../../core/models/clients/clients-interfaces';
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CombinedUserClient {
  id: string; // id del user
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
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

  getClients(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(`${this.apiUrl}/Clients/all`, { withCredentials: true });
  }


}
