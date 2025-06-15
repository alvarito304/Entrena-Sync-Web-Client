import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FitnessServiceService } from '../services/fitness-service.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../keycloak/services/auth.service';
import { switchMap, throwError } from 'rxjs';
import { PrimaryButtonComponent } from '../../../core/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../core/components/secondary-button/secondary-button.component';
import { ClientService } from '../../clients/service/clients.service';
import { ClientUpdateRequest, ClientResponse } from '../../../core/models/clients/clients-interfaces';

@Component({
  selector: 'app-payment-success',
  imports: [
    PrimaryButtonComponent,
    SecondaryButtonComponent
  ],
  templateUrl: './payment-success.component.html',
  standalone: true,
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private fitnessService: FitnessServiceService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const serviceId = sessionStorage.getItem('pendingServiceId');
    if (typeof !!sessionStorage) {
      if (sessionId && serviceId) {
        this.fitnessService.confirmPayment(sessionId).pipe(
          switchMap(() => this.authService.getAuthClient()),
          switchMap((client: ClientResponse) => {
            if (!client || !client.id) {
              console.error('❌ Client data not available after authentication or client ID is missing.');
              this.messageService.add({ severity: 'error', summary: 'Error de Autenticación', detail: 'No se pudieron obtener los datos del cliente. Por favor, intente iniciar sesión de nuevo.' });
              return throwError(() => new Error('Client data not available or client ID is missing'));
            }

            const updatedHiredServicesIds = [...(client.hiredServicesIds || [])];
            if (!updatedHiredServicesIds.includes(serviceId)) {
              updatedHiredServicesIds.push(serviceId);
            }

            const clientUpdateRequest: ClientUpdateRequest = {
              name: client.name,
              address: client.address,
              avatar: client.avatar,
              phone: client.phone,
              gender: client.gender,
              hiredServicesIds: updatedHiredServicesIds,
              workouts: client.workouts
            };

            return this.clientService.updateClient(client.id, clientUpdateRequest).pipe(
              switchMap(() => this.fitnessService.getServiceById(serviceId!)),
              switchMap((service) => {
                if (!service) {
                  console.error('❌ Service data not available after fetching by ID.');
                  this.messageService.add({ severity: 'error', summary: 'Error de Servicio', detail: 'No se pudo obtener información del servicio contratado.' });
                  return throwError(() => new Error('Service data not available'));
                }
                const planRequest = {
                  price: service.price,
                  clientId: client.id,
                  serviceId: serviceId!,
                  description: `Suscripción a ${service.name}`,
                  type: service.type
                };
                return this.fitnessService.createServicePlan(planRequest);
              })
            );
          })
        ).subscribe({
          next: (plan) => {
            console.log('✅ Plan creado:', plan);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Suscripción procesada y plan de servicio creado correctamente.' });
            sessionStorage.removeItem('pendingServiceId');
            sessionStorage.removeItem('pendingServicePrice');
          },
          error: (err) => {
            console.error('❌ Error en el proceso de post-pago:', err);
            this.messageService.add({ severity: 'error', summary: 'Error en Suscripción', detail: 'Hubo un problema al actualizar su suscripción o crear el plan de servicio. Por favor, contacte a soporte.' });
          }
        });
      } else {
        console.error('❌ Session ID o Service ID faltan en ngOnInit de PaymentSuccessComponent.');
        if (!serviceId) {
          this.messageService.add({ severity: 'error', summary: 'Error de Suscripción', detail: 'No se encontró información del servicio pendiente. Por favor, intente el proceso de suscripción de nuevo.' });
        }
      }
    }
  }

  navigateToMySubscriptions(): void {
    this.router.navigate(['/my-services']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
