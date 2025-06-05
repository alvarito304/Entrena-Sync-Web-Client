import { Component } from '@angular/core';
import {GenericTableComponent} from '../../../core/components/generic-table/generic-table.component';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {DropdownModule} from 'primeng/dropdown';
import {InputText} from 'primeng/inputtext';
import {AdminPanelService, UpateUserRequest, WorkerRequest, WorkerUpdateRequest} from '../services/admin-panel.service';
import {catchError, finalize, forkJoin, map, of, tap, throwError} from 'rxjs';
import {JsonPipe, NgIf} from '@angular/common';
import {UserRequest} from '../../keycloak/services/auth.service';

interface CombinedWorker {
  workerId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  birthdate: Date;
  gender: string;
  workerType: string;
}
@Component({
  selector: 'app-worker-administration',
  imports: [
    GenericTableComponent,
    DatePicker,
    DropdownModule,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    JsonPipe,
    NgIf
  ],
  templateUrl: './worker-administration.component.html',
  standalone: true,
  styleUrl: './worker-administration.component.css'
})
export class WorkerAdministrationComponent {
  workerForm: FormGroup;

  constructor(private messageService: MessageService, private router: Router, private fb: FormBuilder, private adminService: AdminPanelService) {
    this.workerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      workerType: ['', Validators.required]
    });

  }
  combinedWorkers: {
    workerType: string | undefined;
    firstName: string;
    lastName: string;
    address: string | undefined;
    gender: string | undefined;
    phone: string | undefined;
    birthdate: string | undefined;
    email: string
  }[] = [];
  isFormValid: boolean = false;
  loading = false;
  submitted: boolean = false;
  cols = [
    { field: 'email', header: 'Email', style: 'min-width: 16rem' },
    { field: 'firstName', header: 'First Name', style: 'min-width: 12rem' },
    { field: 'lastName', header: 'Last Name', style: 'min-width: 12rem' },
    { field: 'address', header: 'Address', style: 'min-width: 16rem' },
    { field: 'phone', header: 'Phone', style: 'min-width: 10rem' },
    { field: 'birthdate', header: 'Birth Date', style: 'min-width: 12rem' },
    { field: 'gender', header: 'Gender', style: 'min-width: 8rem' },
    { field: 'workerType', header: 'Worker Type', style: 'min-width: 14rem' }
  ];

  page = 0;

  genders = [
    { label: 'Femenino', value: 'Femenino' },
    { label: 'Masculino', value: 'Masculino' },
  ];

  size = 5;
  totalElements = 0;
  displayDialog = false;

  isEditMode: boolean = false;
  currentMode: 'create' | 'edit' = 'create';
  setMode(user: any) {
    this.currentMode = this.isEditing(user) ? 'edit' : 'create';
    console.log('Mode set to:', this.currentMode, 'for user:', user);
  }
  isEditing(user: any): boolean {
    const isEdit = !!(user && (user.userId || user.id || user.workerId));

    console.log('Checking edit mode:', { user, isEdit });

    return isEdit;
  }

  checkIfEditMode(user: any): boolean {
    return !!(user?.userId || user?.id || user?.workerId);
  }

  save(worker: CombinedWorker) {
    this.submitted = true;

    if (!this.workerForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete todos los campos requeridos.',
        life: 5000
      });
      return;
    }

    this.loading = true;

    // Obtener valores del formulario
    const formValues = this.workerForm.value;

    // Determinar si es edición o creación
    const isEdit = !!(worker?.userId || worker?.workerId);

    if (isEdit) {
      // MODO EDICIÓN
      const userUpdateRequest: UpateUserRequest = {
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
      };

      const workerUpdateRequest: WorkerUpdateRequest = {
        fullName: `${formValues.firstName} ${formValues.lastName}`,
        address: formValues.address,
        phone: formValues.phone,
        gender: formValues.gender,
        workerType: formValues.workerType
      };

      this.adminService.updateUserAndWorker(
        worker.userId!,
        userUpdateRequest,
        worker.workerId!,
        workerUpdateRequest
      )
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Trabajador actualizado correctamente'
            });
            this.loadWorkers(this.page, this.size);
          }),
          catchError(err => {
            const serverMsg = err.error?.message || 'Error desconocido';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar',
              detail: serverMsg
            });
            return throwError(() => err);
          }),
          finalize(() => {
            this.submitted = false;
            this.workerForm.reset();
            this.loading = false;
          })
        ).subscribe();

    } else {
      // MODO CREACIÓN
      const userRequest: UserRequest = {
        username: formValues.email,
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        password: 'TempPassword123!', // O generar una contraseña temporal
        type: 'worker', // Asumiendo que hay un tipo 'worker'
        passwordConfirmation: 'TempPassword123!'
      };

      const birthDateFormatted = formValues.birthdate ? this.formatDateToCustom(new Date(formValues.birthdate)) : '';

      const workerRequest: WorkerRequest = {
        id_user: '', // Se establecerá en el servicio
        fullName: `${formValues.firstName} ${formValues.lastName}`,
        address: formValues.address,
        phone: formValues.phone,
        birthdate: birthDateFormatted,
        gender: formValues.gender,
        workerType: formValues.workerType
      };

      this.adminService.registerUserAndWorker(userRequest, workerRequest)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Trabajador creado correctamente'
            });
            this.loadWorkers(this.page, this.size);
          }),
          catchError(err => {
            const serverMsg = err.error?.message || 'Error desconocido';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al crear',
              detail: serverMsg
            });
            return throwError(() => err);
          }),
          finalize(() => {
            this.submitted = false;
            this.workerForm.reset();
            this.loading = false;
          })
        ).subscribe();
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  formatDateToCustom(dateInput: any): string {
    let date: Date;

    // Manejar diferentes tipos de entrada
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      console.error('Invalid date input:', dateInput);
      return '';
    }

    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateInput);
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  delete(worker: CombinedWorker) {
    console.log('Deleting worker:', worker);
  }

  ngOnInit() {
    this.loadWorkers(this.page, this.size);
    this.workerForm.statusChanges.subscribe((status) => {
      this.isFormValid = status === 'VALID';
    });
  }

  loadWorkers(page: number, size: number) {
    this.loading = true;

    this.adminService.getWorkersUsers(page, size).subscribe({
      next: (userPaged) => {
        const users = userPaged.content;

        this.adminService.getWorkers().subscribe({
          next: (workersResponse) => {
            const workers = Array.isArray(workersResponse) ? workersResponse : workersResponse.content;

            const combinedObservables = users.map(user => {
              const worker = workers.find(w => w.id_user === user.id);

              if (!worker) {
                return of({
                  userId: user.id,
                  workerId: undefined,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  address: undefined,
                  phone: undefined,
                  gender: undefined,
                  birthdate: undefined,
                  workerType: undefined
                });
              }
              return this.adminService.getWorkerTypeById(worker.id_workerType).pipe(
                map(workerType => ({
                  userId: user.id,
                  workerId: worker.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  address: worker.address,
                  phone: worker.phone?.trim(),
                  gender: worker.gender,
                  birthdate: worker.birthdate ? this.formatDate(worker.birthdate) : undefined,
                  workerType: workerType?.name ?? 'Desconocido'
                })),
                catchError(() => of({
                  userId: user.id,
                  workerId: worker.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  address: worker.address,
                  phone: worker.phone?.trim(),
                  gender: worker.gender,
                  birthdate: worker.birthdate ? this.formatDateToCustom(worker.birthdate) : undefined,
                  workerType: 'Desconocido'
                }))
              );
            });

            forkJoin(combinedObservables).subscribe(combined => {
              this.combinedWorkers = combined;
              this.page = userPaged.page;
              this.size = userPaged.size;
              this.totalElements = userPaged.totalElements;
              this.loading = false;
              console.log('combinedWorkers:', this.combinedWorkers);
            });
          },
          error: (error) => {
            console.error('Error loading workers:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cargar los datos de trabajadores'
            });
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading worker users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los usuarios trabajadores'
        });
        this.loading = false;
      }
    });
  }

}
