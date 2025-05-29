import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AdminPanelService, CombinedUserClient } from '../services/admin-panel.service';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {routes} from '../../../app.routes';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './edit-profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isLoadingData = true;
  currentUserClient: CombinedUserClient | null = null;

  // IDs que normalmente vendrían de la autenticación o parámetros de ruta
  private userId = 'user-123'; // En producción, obtener del servicio de auth
  private clientId = 'client-456'; // En producción, obtener del servicio de auth

  constructor(
    private formBuilder: FormBuilder,
    private adminPanelService: AdminPanelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.profileForm = this.createForm();
    this.onCancel = this.onCancel.bind(this);
  }

  ngOnInit(): void {
    this.loadUserClientData();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      phone: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      birthDate: [''],
      gender: ['']
    });
  }

  private loadUserClientData(): void {
    this.isLoadingData = true;

    this.adminPanelService.getAuthenticatedUserAndClient()
      .subscribe({
        next: (data: CombinedUserClient) => {
          this.currentUserClient = data;
          this.profileForm.patchValue({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address || '',
            phone: data.phone || '',
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
            gender: (data.gender || '').toLowerCase()
          });
          this.isLoadingData = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario/cliente:', error);
          this.isLoadingData = false;
          alert('Error al cargar los datos del perfil');
        }
      });
  }

  onSubmit(): void {
    // Implementación pendiente
    if (this.profileForm.valid && this.currentUserClient) {
      this.isLoading = true;

      // Simulación de guardado
      setTimeout(() => {
        this.isLoading = false;
        alert('Perfil actualizado correctamente');
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    if (this.currentUserClient) {
      this.profileForm.patchValue({
        email: this.currentUserClient.email,
        firstName: this.currentUserClient.firstName,
        lastName: this.currentUserClient.lastName,
        address: this.currentUserClient.address || '',
        phone: this.currentUserClient.phone || '',
        birthDate: this.currentUserClient.birthDate ? new Date(this.currentUserClient.birthDate) : null,
        gender: (this.currentUserClient.gender || '').toLowerCase()
      });
    }
   this.goBack();
  }

  private goBack(){
    this.router.navigate(['/exercises']);
  }


  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles en el template
  get email() { return this.profileForm.get('email'); }
  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get address() { return this.profileForm.get('address'); }
  get phone() { return this.profileForm.get('phone'); }
  get birthDate() { return this.profileForm.get('birthDate'); }
  get gender() { return this.profileForm.get('gender'); }
}
