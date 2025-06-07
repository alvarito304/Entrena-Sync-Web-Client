import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, forkJoin, map, Observable, switchMap, throwError} from 'rxjs';
import {AuthService, UserRequest, UserResponse} from '../../keycloak/services/auth.service';
import {
  ClientCreateRequest,
  ClientResponse,
  ClientUpdateRequest
} from '../../../core/models/clients/clients-interfaces';
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CloudinaryUploadResponse {
  publicId: string; // ID de la imagen en Cloudinary
  secureUrl: string; // URL segura de la imagen
}

export interface WorkerTypeResponse {
  id: string;
  name: string;
}

export interface CombinedUserClient {
  userId: string; // id del user
  clientId?: string; // id del cliente
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  avatar?: string;
}

export interface WorkerResponse {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  birthdate: string;
  workerType: string;
  gender: string;
}

export interface WorkerRequest {
  id_user: string;
  fullName: string;
  address: string;
  phone: string;
  birthdate: string;
  gender: string;
  workerType: string;
}

export interface WorkerUpdateRequest {
  fullName?: string;
  address?: string;
  phone?: string;
  gender?: string;
  workerType?: string;
}
export interface UpateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  passwordConfirmation?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  private apiUrl = environment.apiUrl;
  private readonly DEFAULT_AVATAR_ID = 'undefinedAvatar_w8za89';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getUserPhotoUrl(photoId: String) {
    return this.http.get<{ secure_url: string }>(`${this.apiUrl}/storage/images/${photoId}`);
  }

  updatePhoto(photoId: string, file: File, clientId: string) {
    const isDefaultAvatar = photoId === this.DEFAULT_AVATAR_ID;

    // Crear el observable inicial basado en si necesitamos eliminar o no
    let initialStep;

    if (isDefaultAvatar) {
      // No eliminar, crear un observable que no hace nada
      initialStep = new Observable(subscriber => {
        subscriber.next(null);
        subscriber.complete();
      });
    } else {
      // Eliminar la imagen existente
      initialStep = this.http.delete(`${this.apiUrl}/storage/images/${photoId}`, { withCredentials: true });
    }

    return initialStep.pipe(
      switchMap(() => {
        // Subir la nueva imagen
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<CloudinaryUploadResponse>(`${this.apiUrl}/storage/images`, formData, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
      }),
      switchMap((uploadResponse: CloudinaryUploadResponse) => {
        // Actualizar el campo avatar del cliente
        console.log("Subida exitosa de la imagen:", uploadResponse);
        const updateData = {
          avatar: uploadResponse.publicId
        };
        console.log('Actualizando cliente con avatar:', updateData);
        return this.http.put(`${this.apiUrl}/Clients/${clientId}`, updateData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }).pipe(
          map(() => uploadResponse)
        );
      }),
      catchError(err => {
        console.error('Error actualizando foto:', err);
        return throwError(() => err);
      })
    );
  }


  getUsers(page: number = 0, size: number = 10): Observable<PagedResponse<UserResponse>> {
    return this.http.get<PagedResponse<UserResponse>>(`${this.apiUrl}/keycloak/user?page=${page}&size=${size}`, { withCredentials: true });
  }

  getWorkersUsers(page: number = 0, size: number = 10, type:string = "worker"): Observable<PagedResponse<UserResponse>> {
    return this.http.get<PagedResponse<UserResponse>>(`${this.apiUrl}/keycloak/user?page=${page}&size=${size}&type=${type}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Error obteniendo usuarios trabajadores:', err);
        return throwError(() => err);
      })
    );
  }

  getClients(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(`${this.apiUrl}/Clients/all`, { withCredentials: true });
  }

  getClientsByUserId(userId: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.apiUrl}/Clients/user/${userId}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Error obteniendo cliente por ID de usuario:', err);
        return throwError(() => err);
      })
    );
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

  getAuthenticatedUserAndClient(): Observable<CombinedUserClient> {
    return this.authService.getUserInfo().pipe(
      switchMap((user) => {
        if (user && user.id) {
          return this.http.get<ClientResponse>(`${this.apiUrl}/Clients/user/${user.id}`, { withCredentials: true }).pipe(
            map((client) => {
              const combined: CombinedUserClient = {
                userId: user.id,
                clientId: client.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: client.address,
                phone: client.phone,
                birthDate: client.birthDate,
                gender: client.gender,
                avatar: client.avatar
              };
              return combined;
            })
          );
        } else {
          throw new Error('Usuario no autenticado');
        }
      }),
      catchError(err => {
        console.error('Error obteniendo usuario y cliente:', err);
        return throwError(() => err);
      })
    );
  }

  updateUserAndClient(userId: string, userRequest: UpateUserRequest, clientId: string, clientRequest: ClientUpdateRequest): Observable<any> {
    const updateUser$ = this.http.put(`${this.apiUrl}/keycloak/user/${userId}`, userRequest, { withCredentials: true });

    const updateClient$ = this.http.put(`${this.apiUrl}/Clients/${clientId}`, clientRequest, { withCredentials: true });

    return forkJoin([updateUser$, updateClient$]).pipe(
      catchError(err => {
        console.error('Error actualizando usuario y cliente:', err);
        return throwError(() => err);
      })
    );
  }

  getWorkers(page: number = 0, size: number = 10): Observable<PagedResponse<WorkerResponse>> {
    return this.http.get<PagedResponse<WorkerResponse>>(`${this.apiUrl}/workers`, { withCredentials: true });
  }

  getWorkerTypeById(workerId: string): Observable<WorkerTypeResponse> {
    return this.http.get<WorkerTypeResponse>(`${this.apiUrl}/workers/type/${workerId}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Error obteniendo tipo de trabajador por ID:', err);
        return throwError(() => err);
      })
    );
  }

  registerUserAndWorker(userRequest: UserRequest, workerRequest: WorkerRequest): Observable<any> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/keycloak/user`, userRequest, {withCredentials: true}).pipe(
      switchMap((response) => {
        const keycloakUserId = response.id;

        const fullWorkertRequest: WorkerRequest = {
          ...workerRequest,
          id_user: keycloakUserId
        };

        return this.http.post(`${this.apiUrl}/workers`, fullWorkertRequest, {withCredentials: true});
      })
    );
  }

  updateUserAndWorker(userId: string, userRequest: UpateUserRequest, workerId: string, workerRequest: WorkerUpdateRequest): Observable<any> {
    const updateUser$ = this.http.put(`${this.apiUrl}/keycloak/user/${userId}`, userRequest, { withCredentials: true });

    const updateClient$ = this.http.put(`${this.apiUrl}/workers/${workerId}`, workerRequest, { withCredentials: true });

    return forkJoin([updateUser$, updateClient$]).pipe(
      catchError(err => {
        console.error('Error actualizando usuario y cliente:', err);
        return throwError(() => err);
      })
    );
  }

}
