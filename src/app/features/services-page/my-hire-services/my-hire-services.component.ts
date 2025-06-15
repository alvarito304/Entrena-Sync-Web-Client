import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Badge} from 'primeng/badge';
import {NgForOf, NgIf} from '@angular/common';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {FitnessServiceService} from '../services/fitness-service.service';
import {AuthService} from '../../keycloak/services/auth.service';
import { PrimaryButtonComponent } from "../../../core/components/primary-button/primary-button.component";

@Component({
  selector: 'app-my-hire-services',
  standalone: true,
  imports: [
    Button,
    Badge,
    NgForOf,
    NgIf,
    ConfirmDialog,
    PrimaryButtonComponent
],
  providers: [ConfirmationService],
  templateUrl: './my-hire-services.component.html',
  styleUrl: './my-hire-services.component.css'
})
export class MyHireServicesComponent implements OnInit {
  subscriptions: any = [];
  isLoading: boolean = true;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fitnessServuce: FitnessServiceService,
    private authService: AuthService
) {}

  ngOnInit(): void {
    this.loadHiredServices();
  }

  loadHiredServices()
  {
    this.isLoading = true
    this.authService.getAuthClient().subscribe({
      next: (client) => {
        const clientId = client.id
        this.fitnessServuce.loadClientHiredServices(clientId).subscribe({
          next: (plans) => {
            // ✅ Verificar si plans está vacío ANTES de continuar
            if (!plans || plans.length === 0) {
              console.log("ℹ️ No hay planes contratados para este cliente")
              this.subscriptions = []
              this.isLoading = false
              return
            }

            const serviceIds = plans.map((plan) => plan.serviceId)

            // ✅ Verificación adicional por si acaso
            if (serviceIds.length === 0) {
              console.log("ℹ️ No hay serviceIds para procesar")
              this.subscriptions = []
              this.isLoading = false
              return
            }

            this.fitnessServuce.getServicesByIds(serviceIds).subscribe({
              next: (services) => {
                this.subscriptions = plans.map((plan) => {
                  const service = services.find((s) => s.id === plan.serviceId)
                  return {
                    id: plan.id,
                    name: service?.name || "Servicio contratado",
                    description: plan.description,
                    price: plan.price,
                    nextBillingDate: plan.renovation || "Sin renovación",
                    time: service?.time,
                    location: service?.location,
                    isDeleted: plan.isDeleted || false,
                  }
                })
                this.isLoading = false
              },
              error: (err) => {
                console.error("❌ Error al cargar servicios:", err)
                this.isLoading = false
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "No se pudieron cargar los datos de los servicios contratados.",
                })
              },
            })
          },
          error: (err) => {
            console.error("❌ Error al cargar planes contratados:", err)
            this.isLoading = false
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "No se pudieron cargar los planes contratados.",
            })
          },
        })
      },
      error: (err) => {
        console.error("❌ Error al obtener cliente:", err)
        this.isLoading = false
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo obtener el cliente autenticado.",
        })
      },
    })
  }

  confirmDelete(subscriptionId: string) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres cancelar esta suscripción?',
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.deleteSubscription(subscriptionId);
      }
    });
  }


  deleteSubscription(subscriptionId: string) {
    this.fitnessServuce.deleteClientHiredService(subscriptionId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Suscripción cancelada correctamente.'
        });
        this.loadHiredServices();
      },
      error: (err) => {
        console.error('❌ Error al cancelar suscripción:', err);
        if (err.status === 400) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cancelación no permitida',
            detail: 'La suscripción no puede cancelarse aún, deben quedar mínimo 5 días para su renovación.'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cancelar la suscripción.'
          });
        }
      }
    });
  }

}
