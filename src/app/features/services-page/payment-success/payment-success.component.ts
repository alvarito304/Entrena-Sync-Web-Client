import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FitnessServiceService} from '../services/fitness-service.service';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../keycloak/services/auth.service';
import {ButtonDirective} from 'primeng/button';

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
      this.fitnessService.confirmPayment(sessionId).subscribe({
        next: () => {
          this.authService.getAuthClient().subscribe({
            next: (client) => {
              this.fitnessService.upateClientHiredServices(client.id, [serviceId]).subscribe({
                next: () => {
                  this.messageService.add({severity: 'success', summary: 'Suscripción actualizada'});
                  sessionStorage.removeItem('pendingServiceId');
                },
                error: (err) => {
                  console.error('Error actualizando servicios:', err);
                  this.messageService.add({severity: 'error', summary: 'Error actualizando cliente'});
                }
              });
            }
          });
        }
      });
    }
  }
}
