import { Component } from '@angular/core';
import {AdminPanelService, CombinedUserClient, UpateUserRequest} from '../services/admin-panel.service';
import {UserRequest, UserResponse} from '../../keycloak/services/auth.service';
import {Router} from '@angular/router';
import {GenericTableComponent} from '../../../core/components/generic-table/generic-table.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {DropdownModule} from 'primeng/dropdown';
import {ClientCreateRequest} from '../../../core/models/clients/clients-interfaces';
import {CalendarModule} from 'primeng/calendar';

@Component({
  selector: 'app-user-administration',
  imports: [
    GenericTableComponent,
    FormsModule,
    CalendarModule,
    CommonModule,
    InputText,
    DatePicker,
    DropdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-administration.component.html',
  standalone: true,
  styleUrl: './user-administration.component.css'
})
export class UserAdministrationComponent {
  userForm: FormGroup;
  constructor(private adminPanelService: AdminPanelService, private router: Router, private messageService: MessageService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: [''],
      gender: [''],
      birthDate: [''],
    });
  }


  cols = [
    { field: 'email', header: 'Email' ,  style: 'min-width: 16rem' },
    { field: 'firstName', header: 'First Name',  style: 'min-width: 16rem'  },
    { field: 'lastName', header: 'Last Name',  style: 'min-width: 16rem'  },
    { field: 'address', header: 'Address',  style: 'min-width: 16rem'  },
    { field: 'phone', header: 'Phone',  style: 'min-width: 16rem'  },
    { field: 'birthDate', header: 'Birth Date',  style: 'min-width: 16rem'  },
    { field: 'gender', header: 'Gender',  style: 'min-width: 16rem'  },
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
  combinedUsers: CombinedUserClient[] = [];
  isFormValid: boolean = false;
  loading = false;
  submitted: boolean = false;
  ngOnInit() {
    this.loadCombinedUsers(this.page, this.size);
    this.userForm.statusChanges.subscribe((status) => {
      this.isFormValid = status === 'VALID';
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  loadCombinedUsers(page: number, size: number) {
    this.loading = true;

    this.adminPanelService.getUsersCLients(page, size).subscribe({
      next: userPaged => {
        const users = userPaged.content;

        this.adminPanelService.getClients().subscribe({
          next: clients => {
            this.combinedUsers = users.map(user => {
              const client = clients.find(c => c.userId === user.id);
              return {
                userId: user.id,
                clientId: client?.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: client?.address,
                phone: client?.phone?.trim(),
                birthDate: client?.birthDate ? this.formatDate(client.birthDate) : undefined,
                gender: client?.gender
              };
            });
            console.log('combinedUsers:', this.combinedUsers);
            this.page = userPaged.page;
            this.size = userPaged.size;
            this.totalElements = userPaged.totalElements;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading clients:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
  onPageChange(event: any) {
    this.loadCombinedUsers(event.page, event.rows);
  }

  deleteUser(user: CombinedUserClient) {
    if (!user.userId) {
      console.error('Falta el ID de usuario necesario para eliminar');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se puede eliminar: falta información del usuario',
        life: 3000
      });
      return;
    }

    // Si tiene clientId, intentar eliminar el cliente primero
    if (user.clientId) {
      this.adminPanelService.deleteClientById(user.clientId).subscribe({
        next: () => {
          // Cliente eliminado exitosamente, ahora eliminar usuario
          this.deleteUserOnly(user.userId);
        },
        error: err => {
          console.error('Error al eliminar cliente:', err);

          // Si el cliente no existe (404) o ya fue eliminado, proceder a eliminar solo el usuario
          if (err.status === 404 || err.status === 410) {
            console.log('Cliente no encontrado, procediendo a eliminar solo el usuario');
            this.deleteUserOnly(user.userId);
          } else {
            // Error real al eliminar cliente
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cliente',
              life: 3000
            });
          }
        }
      });
    } else {
      this.deleteUserOnly(user.userId);
    }
  }


  private deleteUserOnly(userId: string) {
    this.adminPanelService.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Usuario eliminado correctamente',
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
  }

  save(user: CombinedUserClient) {
    this.submitted = true;
    if (this.userForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete todos los campos requeridos.',
        life: 5000
      });
      return;
    }

    console.log('SAVE CALLED', user);
    if (user) {
      const userReq: UserRequest = {
        username: user.email,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: 'TempPassword123!',
        type: 'client',
        passwordConfirmation: 'TempPassword123!',
        roles: ['Client']
      };

      const userUpReq: UpateUserRequest = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }

      const birthDateFormatted = user.birthDate ? this.formatDateToCustom(new Date(user.birthDate)) : '';

      const clientReq: ClientCreateRequest = {
        name: `${user.firstName} ${user.lastName}`,
        address: user.address ?? '',
        phone: user.phone ?? '',
        birthDate: birthDateFormatted ?? '',
        gender: user.gender ?? '',
        userId: user.userId ?? ''  // importante para edición
      };

      if (!user.userId) {
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
      } else {
        this.adminPanelService.updateUserAndClient(user.userId, userUpReq, user.clientId ?? '', clientReq).subscribe({
          next: () => {
            this.displayDialog = false;
            this.loadCombinedUsers(this.page, this.size);
          },
          error: (err) => {
            console.error('Error updating user and client:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Actualización fallida',
              detail: err?.error?.message || 'No se pudo completar la actualización.',
              life: 5000
            });
          }
        });
      }
    }
  }


  formatDateToCustom(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  hideDialog() {
    this.displayDialog = false;
    this.current = null;
  }
}
