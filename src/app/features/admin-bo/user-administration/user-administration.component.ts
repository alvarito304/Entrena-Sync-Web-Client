import { Component } from '@angular/core';
import {AdminPanelService, CombinedUserClient} from '../services/admin-panel.service';
import {AuthService, UserRequest, UserResponse} from '../../keycloak/services/auth.service';
import {Router} from '@angular/router';
import {GenericTableComponent} from '../../../core/components/generic-table/generic-table.component';
import {FormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {Dialog} from 'primeng/dialog';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {DropdownModule} from 'primeng/dropdown';
import {ClientCreateRequest} from '../../../core/models/clients/clients-interfaces';

@Component({
  selector: 'app-user-administration',
  imports: [
    GenericTableComponent,
    FormsModule,
    MultiSelect,
    Dialog,
    PrimeTemplate,
    ButtonDirective,
    NgTemplateOutlet,
    NgIf,
    InputText,
    DatePicker,
    DropdownModule
  ],
  templateUrl: './user-administration.component.html',
  standalone: true,
  styleUrl: './user-administration.component.css'
})
export class UserAdministrationComponent {
  constructor(private adminPanelService: AdminPanelService, private router: Router, private messageService: MessageService) {
  }
  cols = [
    { field: 'email', header: 'Email' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'address', header: 'Address' },
    { field: 'phone', header: 'Phone' },
    { field: 'birthDate', header: 'Birth Date' },
    { field: 'gender', header: 'Gender' },
  ];
  page = 0;

  genders = [
    { label: 'Femenino', value: 'Femenino' },
    { label: 'Masculino', value: 'Masculino' },
  ];

  size = 5;
  totalElements = 0;
  displayDialog = false;

  current: CombinedUserClient | null = null;
  isNew = false;

  users: UserResponse[] = [];
  combinedUsers: {
    firstName: string;
    lastName: string;
    clientId: string | undefined;
    address: string | undefined;
    gender: string | undefined;
    phone: string | undefined;
    userId: string;
    birthDate: string | undefined;
    email: string
  }[] = [];

  ngOnInit() {
    this.loadCombinedUsers(this.page, this.size);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  loadCombinedUsers(page: number, size: number) {
    this.adminPanelService.getUsers(page, size).subscribe(userPaged => {
      const users = userPaged.content;

      this.adminPanelService.getClients().subscribe(clients => {
        this.combinedUsers = users.map(user => {
          const client = clients.find(c => c.userId === user.id);
          return {
            userId: user.id,
            clientId: client?.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: client?.address,
            phone: client?.phone.trim(),
            birthDate: client?.birthDate ? this.formatDate(client.birthDate) : undefined,
            gender: client?.gender
          };
        });
        console.log('combinedUsers:', this.combinedUsers);
        this.page = userPaged.page;
        this.size = userPaged.size;
        this.totalElements = userPaged.totalElements;
      });
    });
  }

  onPageChange(event: any) {
    this.loadCombinedUsers(event.page, event.rows);
  }

  showEditDialog(user?: CombinedUserClient) {
    this.isNew = !user;
    this.current = user ? { ...user } : {
      userId: '',
      clientId: '',
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      birthDate: '',
      gender: ''
    };
    this.displayDialog = true;
  }


  deleteUser(user: CombinedUserClient) {
    if (!user.clientId || !user.userId) {
      console.error('Faltan los IDs necesarios para eliminar');
      return;
    }

    this.adminPanelService.deleteClientById(user.clientId).subscribe({
      next: () => {
        this.adminPanelService.deleteUser(user.userId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Usuario y cliente eliminados correctamente',
              life: 3000
            });
            this.loadCombinedUsers(this.page, this.size);
          },
          error: err => {
            console.error('Error al eliminar usuario:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el usuario',
              life: 3000
            });
          }
        });
      },
      error: err => {
        console.error('Error al eliminar cliente:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cliente',
          life: 3000
        });
      }
    });
  }


  deleteSelectedUsers(users: UserResponse[]) {
    console.log('Delete multiple users', users);
  }

  save() {
    console.log('SAVE CALLED', this.current);
    if (this.current) {
      const userReq: UserRequest = {
        username: this.current.email,
        email: this.current.email,
        firstName: this.current.firstName,
        lastName: this.current.lastName,
        password: 'TempPassword123!', //TODO cambio de contraseña
        passwordConfirmation: 'TempPassword123!'
      };

      const clientReq: ClientCreateRequest = {
        name: `${this.current.firstName} ${this.current.lastName}`,
        address: this.current.address ?? '',
        phone: this.current.phone ?? '',
        birthDate: this.current.birthDate ? new Date(this.current.birthDate).toISOString() : '',
        gender: this.current.gender ?? '',
        userId: '' // se completa en el servicio
      };

      this.adminPanelService.registerUserAndClient(userReq, clientReq).subscribe({
        next: () => {
          this.displayDialog = false;
          this.loadCombinedUsers(this.page, this.size);
        },
        error: (err) => {
          console.error('Error creating user and client:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Registro fallido',
            detail: err?.error?.message || 'No se pudo completar el registro.',
            life: 5000
          });
        }
      });
    }
  }


  hideDialog() {
    this.displayDialog = false;
    this.current = null;
  }

}
