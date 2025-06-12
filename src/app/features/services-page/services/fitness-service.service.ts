import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, forkJoin, Observable, throwError} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {ClientResponse} from '../../../core/models/clients/clients-interfaces';

export interface FitnessService {
  id: string;
  name: string;
  description: string;
  price: number;
  time: string | undefined;
  location: string | undefined;
  type: string;
  createdAt: string ;
}

export interface FitnessPlanCreateRequest {
    price: number;
    clientId: string;
    serviceId: string;
    description: string;
    type: string;
}
export interface FitnessPlanResponse {
  id: string;
  price: number
  clientId: string;
  serviceId: string;
  description: string;
  type: string;
  createdAt: string | undefined;
  renovation: string | undefined;
  isDeleted: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class FitnessServiceService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) { }

  getServiceById(id: string): Observable<FitnessService> {
    return this.http.get<FitnessService>(`${this.apiUrl}/services/${id}`, {withCredentials: true});
  }

  getServicesByIds(ids: string[]): Observable<FitnessService[]> {
    return forkJoin(ids.map(id => this.getServiceById(id)));
  }

  makePayment(payment: String){
    this.http.post<{ url: string }>(`${this.apiUrl}/payments/create-checkout-session`, {
      serviceName: 'Suscripción mensual',
      amount: payment
    }).subscribe(res => {
      window.location.href = res.url;
    });

  }

  confirmPayment(sessionId: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/payments/confirm-payment`, { sessionId }, {
      responseType: 'text',
      withCredentials: true
    });
  }

  upateClientHiredServices(clientId: string, serviceIds: string[]): Observable<ClientResponse> {
    console.log('Actualizando servicios contratados para el cliente:', clientId, 'con servicios:', serviceIds);
    return this.http.put<ClientResponse>(`${this.apiUrl}/Clients/${clientId}`, {
      hiredServicesIds: serviceIds
    }, {
      withCredentials: true
    }).pipe(
      catchError((err) => {
        console.error('❌ Error real al actualizar cliente:', err);
        return throwError(() => err);
      })
    );
  }

  createServicePlan(request: FitnessPlanCreateRequest): Observable<FitnessPlanResponse> {
    console.log('Creando plan de servicio para el cliente:', request.clientId, 'con datos:', request);
    return this.http.post<FitnessPlanResponse>(`${this.apiUrl}/services/plans`, request, {
      withCredentials: true
    }).pipe(
      catchError((err) => {
        console.error('❌ Error real al crear plan de servicio:', err);
        return throwError(() => err);
      })
    );
  }

  loadClientHiredServices(clientId: string): Observable<FitnessPlanResponse[]> {
    console.log('Cargando servicios contratados para el cliente:', clientId);
    return this.http.get<FitnessPlanResponse[]>(`${this.apiUrl}/services/plans/${clientId}`, {
      withCredentials: true
    }).pipe(
      catchError((err) => {
        console.error('❌ Error real al cargar cliente:', err);
        return throwError(() => err);
      })
    );
  }

  deleteClientHiredService(serviceId: string): Observable<void> {
    console.log('Eliminando servicio contratado: ', serviceId);
    return this.http.delete<void>(`${this.apiUrl}/services/plans/${serviceId}`, {
      withCredentials: true
    }).pipe(
      catchError((err) => {
        console.error('❌ Error real al eliminar servicio contratado:', err);
        return throwError(() => err);
      })
    );
  }

}
