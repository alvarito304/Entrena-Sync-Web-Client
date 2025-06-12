import {Component, OnInit} from '@angular/core';
import {AdminPanelService, CombinedUserClient} from '../../admin-bo/services/admin-panel.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {DatePicker} from 'primeng/datepicker';
import {DropdownModule} from 'primeng/dropdown';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {GenericTableComponent} from '../../../shared/reusable-data-table/reusable-data-table.component';
import {Calendar} from 'primeng/calendar';
import {Column} from '../../../core/models/colum/column';
import {NgIf} from '@angular/common';
import {AuthService} from '../../keycloak/services/auth.service';
import {forkJoin, map, of, switchMap} from 'rxjs';
import {FitnessServiceService} from '../../services-page/services/fitness-service.service';


export interface CombinedUserClientService {
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
  serviceName: string;
  serviceType?: string;
  hiredDate: string;
  price: number
}
@Component({
  selector: 'app-worker-client-administration',
  imports: [
    DatePicker,
    DropdownModule,
    FormsModule,
    GenericTableComponent,
    InputText,
    ReactiveFormsModule,
    GenericTableComponent,
    Calendar,
    NgIf
  ],
  templateUrl: './worker-client-administration.component.html',
  standalone: true,
  styleUrl: './worker-client-administration.component.css',
})
export class WorkerClientAdministrationComponent implements OnInit {
  constructor(
    private adminPanelService: AdminPanelService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private fitnessService: FitnessServiceService,
  ) {}

  combinedUsers: CombinedUserClientService[] = [];
  isLoading = false;

  cols: Column[] = [
    { field: 'email', header: 'Email', style: 'min-width: 16rem', type: 'text' },
    { field: 'firstName', header: 'Nombre', style: 'min-width: 16rem', type: 'text' },
    { field: 'lastName', header: 'Apellidos', style: 'min-width: 16rem', type: 'text' },
    { field: 'serviceName', header: 'Servicio', style: 'min-width: 16rem', type: 'text' },
    { field: 'serviceType', header: 'Tipo de servicio', style: 'min-width: 16rem', type: 'text' },
    { field: 'price', header: 'Precio', type: 'currency',style: 'min-width: 16rem' },
    { field: 'hiredDate', header: 'Fecha contratación', type: 'text'},
  ];

  ngOnInit() {
    this.loadClientsForLoggedWorker();
  }
  loadClientsForLoggedWorker(): void {
    this.isLoading = true;
    console.log("🔄 Iniciando carga de clientes para el trabajador autenticado...");

    this.authService.getUserInfo().pipe(
      switchMap(user => {
        console.log("👤 Usuario autenticado:", user);
        if (!user) throw new Error("No se pudo obtener el usuario autenticado.");
        const userId = user.id;
        return this.adminPanelService.getWorkerByUserId(userId);
      }),
      switchMap(worker => {
        console.log("🧑‍🔧 Trabajador encontrado:", worker);
        const serviceIdsOfWorker = worker.service_list;
        console.log("🛠️ Servicios asociados al trabajador:", serviceIdsOfWorker);
        if (!serviceIdsOfWorker?.length) {
          console.warn("⚠️ El trabajador no tiene servicios asignados.");
          return of([]);
        }

        return this.adminPanelService.getClients().pipe(
          switchMap(clients => {
            console.log("📋 Lista completa de clientes:", clients);

            const filteredClients = clients.filter(client =>
              client.hiredServicesIds?.some(serviceId => serviceIdsOfWorker.includes(serviceId))
            );
            console.log("🧪 Clientes filtrados que coinciden con los servicios del trabajador:", filteredClients);

            const userIds = filteredClients.map(c => c.userId);
            console.log("🔍 IDs de usuarios asociados a los clientes filtrados:", userIds);

            return forkJoin(userIds.map(id => this.adminPanelService.getUserById(id))).pipe(
              switchMap(users => {
                console.log("📦 Usuarios obtenidos por ID:", users);

                return this.fitnessService.getServicesByIds(serviceIdsOfWorker).pipe(
                  map(workerServices => {
                    console.log("💼 Servicios completos del trabajador:", workerServices);

                    const combined: CombinedUserClientService[] = [];

                    filteredClients.forEach(client => {
                      const user = users.find(u => u.id === client.userId);
                      const matchedServiceIds = client.hiredServicesIds?.filter(serviceId =>
                        serviceIdsOfWorker.includes(serviceId)
                      );

                      matchedServiceIds?.forEach(serviceId => {
                        const service = workerServices.find(s => s.id === serviceId);
                        if (user && service) {
                          combined.push({
                            userId: user.id,
                            clientId: client.id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            address: client.address,
                            phone: client.phone,
                            birthDate: client.birthDate,
                            gender: client.gender,
                            avatar: client.avatar,
                            serviceName: service.name,
                            serviceType: service.type,
                            hiredDate: service.createdAt,
                            price: service.price
                          });
                        }
                      });
                    });

                    console.log("✅ Resultado combinado final:", combined);
                    return combined;
                  })
                );
              })
            );
          })
        );
      })
    ).subscribe({
      next: (results) => {
        this.combinedUsers = results;
        console.log("🎯 Datos finales asignados a la tabla:", this.combinedUsers);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("❌ Error cargando clientes del worker:", err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los datos de los clientes.'
        });
        this.isLoading = false;
      }
    });
  }



}
