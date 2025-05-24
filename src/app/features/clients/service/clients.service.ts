// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ClientCreateRequest,
  ClientResponse,
  ClientUpdateRequest
} from '../../../core/models/clients/clients-interfaces';
import {PageResponse} from '../../../core/models/page/page-response-interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = 'http://localhost:8082/Clients';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una página de clientes.
   * @param page número de página (0-indexed)
   * @param size tamaño de página
   */
  getClients(page: number = 0, size: number = 10): Observable<PageResponse<ClientResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<ClientResponse>>(this.API_URL, { params });
  }

  /***
   * Obtiene un cliente por su ID de usuario.
   * @param userId ID de usuario
   * @return Observable<ClientResponse>
   */
  getClientByUserId(userId: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.API_URL}/user/${userId}`);
  }

  /**
   * Obtiene un cliente por su ID.
   * @param id ObjectId del cliente
   * @return Observable<ClientResponse>
   */
  getClientById(id: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea un nuevo cliente.
   * @param client datos del cliente a crear
   * @return Observable<ClientResponse>
   */
  createClient(client: ClientCreateRequest): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(this.API_URL, client);
  }

  /**
   * Actualiza un cliente existente.
   * @param id ObjectId del cliente
   * @param client datos a actualizar
   * @return Observable<ClientResponse>
   */
  updateClient(id: string, client: ClientUpdateRequest): Observable<ClientResponse> {
    return this.http.put<ClientResponse>(`${this.API_URL}/${id}`, client);
  }

  /**
   * Elimina un cliente.
   * @param id ObjectId del cliente
   * @return Observable<void>
   */
  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
