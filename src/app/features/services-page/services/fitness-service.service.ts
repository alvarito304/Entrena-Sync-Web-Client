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



}
