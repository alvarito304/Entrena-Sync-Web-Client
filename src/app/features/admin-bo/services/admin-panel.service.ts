import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, switchMap} from 'rxjs';
import {UserRequest, UserResponse} from '../../keycloak/services/auth.service';
import {ClientCreateRequest, ClientResponse} from '../../../core/models/clients/clients-interfaces';
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CombinedUserClient {
  userId: string; // id del user
  clientId: string; // id del cliente
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

  registerUserAndClient(userRequest: UserRequest, clientRequest: ClientCreateRequest): Observable<any> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/keycloak/user`, userRequest).pipe(
      switchMap((response) => {
        const keycloakUserId = response.id;

        const fullClientRequest: ClientCreateRequest = {
          ...clientRequest,
          userId: keycloakUserId
        };

        return this.http.post(`${this.apiUrl}/Clients`, fullClientRequest);
      })
    );
  }

  deleteClientById(clientId: string) {
    return this.http.delete(`${this.apiUrl}/Clients/${clientId}`, { withCredentials: true });
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/keycloak/user/${userId}`, { withCredentials: true });
  }

}
