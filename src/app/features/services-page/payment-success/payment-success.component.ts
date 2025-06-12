import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FitnessPlanCreateRequest, FitnessServiceService} from '../services/fitness-service.service';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../keycloak/services/auth.service';
import {ButtonDirective} from 'primeng/button';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-payment-success',
  imports: [
    ButtonDirective,
    RouterLink
  ],
  templateUrl: './payment-success.component.html',
  standalone: true,
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent  implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private fitnessService: FitnessServiceService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const serviceId = sessionStorage.getItem('pendingServiceId');

    if (sessionId && serviceId) {
      this.fitnessService.confirmPayment(sessionId).pipe(
        switchMap(() => this.authService.getAuthClient()),
        switchMap((client) => {
          const clientId = client.id;
          return this.fitnessService.upateClientHiredServices(clientId, [serviceId]).pipe(
            switchMap(() => this.fitnessService.getServiceById(serviceId)),
            switchMap((service) => {
              const planRequest: FitnessPlanCreateRequest = {
                clientId: clientId,
                serviceId: serviceId,
                price: service.price,
                description: `Plan para servicio: ${service.name}`,
                type: service.type
              };
              return this.fitnessService.createServicePlan(planRequest);
            })
          );
        })
      ).subscribe({
        next: (plan) => {
          console.log('✅ Plan recibido tipo:', typeof plan); // debe decir "object"
          console.log('✅ Plan recibido es array?', Array.isArray(plan)); // debe ser false
          console.log('✅ Plan creado:', plan);
          this.messageService.add({severity: 'success', summary: 'Suscripción actualizada y plan creado'});
          console.log('✅ Plan creado:', plan);
          sessionStorage.removeItem('pendingServiceId');
        },
        error: (err) => {
          console.error('❌ Error en el proceso:', err);
          this.messageService.add({severity: 'error', summary: 'Error creando el plan de servicio'});
        }
      });
    }
  }


}
