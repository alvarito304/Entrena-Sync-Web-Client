import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AdminPanelService, CombinedUserClient, UpateUserRequest} from '../services/admin-panel.service';
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
import {FileUpload} from 'primeng/fileupload';
import {catchError, EMPTY, finalize, map, of, switchMap} from 'rxjs';
import {AuthService, UserResponse} from '../../keycloak/services/auth.service';
import {ClientCreateRequest, ClientUpdateRequest} from '../../../core/models/clients/clients-interfaces';
import {MessageService} from 'primeng/api';

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
    ProgressSpinnerModule,
    FileUpload
  ],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  profileForm: FormGroup;
  isLoading = false;
  isLoadingData = true;
  isUploadingImage = false; // Estado separado para la carga de imagen
  currentUserClient: CombinedUserClient | null = null;

  currentProfileImage: string | null = null;
  newImagePreview: string | null = null;
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private adminPanelService: AdminPanelService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserClientData();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.email]],
      firstName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      phone: ['', [Validators.pattern(/^(\+34\s?)?[6-7]\d{2}\s?\d{3}\s?\d{3}$/)]],
      gender: ['']
    });
  }


  isFormValid(): boolean {
    if (this.profileForm.valid) {
      return true;
    }

    console.warn('Formulario inválido. Errores:');
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control && control.invalid) {
        console.warn(`- ${key}:`, control.errors);
      }
    });

    return false;
  }


  private loadUserClientData(): void {
    this.isLoadingData = true;

    this.adminPanelService.getAuthenticatedUserAndClient()
      .pipe(
        catchError(error => {
          console.error('Error al cargar datos del usuario/cliente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar datos',
            detail: error?.error?.message || 'No se pudo cargar la información del perfil.',
            life: 5000
          });
          this.isLoadingData = false;
          return EMPTY;
        })
      )
      .subscribe(data => {
        this.currentUserClient = data;
        this.updateFormWithUserData(data);

        if (data.avatar) {
          this.loadAvatarFromUrl(data.avatar);
        }

        this.isLoadingData = false;
      });
  }

  private updateFormWithUserData(data: CombinedUserClient): void {
    this.profileForm.patchValue({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address || '',
      phone: data.phone || '',
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      gender: (data.gender || '').toLowerCase()
    });
  }

  private loadAvatarFromUrl(avatarUrl: string): void {
    if (avatarUrl.startsWith('http')) {
      this.currentProfileImage = avatarUrl;
      return;
    }

    this.adminPanelService.getUserPhotoUrl(avatarUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar la foto del usuario:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar imagen',
            detail: error?.error?.message || 'No se pudo cargar la imagen de perfil.',
            life: 5000
          });
          return EMPTY;
        })
      )
      .subscribe(res => {
        this.currentProfileImage = res.secure_url;
      });
  }

  onImageSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      this.updateImageImmediately();
    }
  }

  private updateImageImmediately(): void {
    if (!this.selectedFile || !this.currentUserClient?.clientId) {
      return;
    }

    this.isUploadingImage = true;

    if (this.currentUserClient.avatar) {
      this.adminPanelService.updatePhoto(
        this.currentUserClient.avatar,
        this.selectedFile,
        this.currentUserClient.clientId
      ).pipe(
        finalize(() => {
          this.isUploadingImage = false;
        })
      ).subscribe({
        next: (response) => {
          this.currentProfileImage = response.secureUrl;
          this.currentUserClient!.avatar = response.secureUrl;
          this.clearImageSelection();
          this.messageService.add({
            severity: 'success',
            summary: 'Imagen actualizada',
            detail: 'La imagen de perfil se actualizó correctamente.',
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error al actualizar la imagen:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error de imagen',
            detail: error?.error?.message || 'No se pudo actualizar la imagen.',
            life: 5000
          });
          this.clearImageSelection();
        }
      });
    } else {
      this.uploadNewImage();
    }
  }

  public uploadNewImage(): void {
    if (!this.selectedFile || !this.currentUserClient?.clientId) {
      return;
    }
    if(!this.currentUserClient?.avatar){
      return;
    }
    console.log('Subiendo nueva imagen:', this.selectedFile.name);
    console.log("en el cliente", this.currentUserClient);
    this.adminPanelService.updatePhoto(
      this.currentUserClient?.avatar,
      this.selectedFile,
      this.currentUserClient.clientId
    ).pipe(
      finalize(() => {
        this.isUploadingImage = false;
      })
    ).subscribe({
      next: (response) => {
        this.currentProfileImage = response.secureUrl;
        this.currentUserClient!.avatar = response.secureUrl;

        this.clearImageSelection();
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen subida',
          detail: 'Imagen de perfil subida correctamente.',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error al subir la imagen:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de imagen',
          detail: error?.error?.message || 'No se pudo subir la imagen.',
          life: 5000
        });
        this.clearImageSelection();
      }
    });
  }


  // Arreglar el bucle infinito
  private clearImageSelection(): void {
    this.selectedFile = null;
    this.newImagePreview = null;
    this.selectedFileName = '';
  }

  onImageClear(): void {
    this.clearImageSelection();
    if (this.fileUpload) {
      setTimeout(() => {
        this.fileUpload.clear();
      }, 0);
    }
  }
  removeNewImage(): void {
    this.clearImageSelection();
  }

  onSubmit(): void {
    if (!this.isFormValid() || !this.currentUserClient) {
      console.error("Formulario inválido o datos del usuario no cargados.");
      this.markFormGroupTouched();
      return;
    }
    console.log('Formulario enviado:', this.profileForm.value);
    this.isLoading = true;

    const userRequest: UpateUserRequest = {
      email: this.profileForm.value.email,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName
    };

    const clientRequest: ClientUpdateRequest = {
      address: this.profileForm.value.address || '',
      phone: this.profileForm.value.phone || '',
      gender: this.profileForm.value.gender || '',
    };

    this.adminPanelService.updateUserAndClient(
      this.currentUserClient.userId,
      userRequest,
      this.currentUserClient.clientId!,
      clientRequest
    ).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil actualizado',
          detail: 'Los datos del perfil se han actualizado correctamente.',
          life: 3000
        });
        this.goBack();
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de actualización',
          detail: error?.error?.message || 'No se pudo actualizar el perfil.',
          life: 5000
        });
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onCancel(): void {
    if (this.currentUserClient) {
      this.updateFormWithUserData(this.currentUserClient);
    }
    this.clearImageSelection();
    this.goBack();
  }

  private goBack(): void {
    this.router.navigate(['/human-body']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() { return this.profileForm.get('email'); }
  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get address() { return this.profileForm.get('address'); }
  get phone() { return this.profileForm.get('phone'); }
  get birthDate() { return this.profileForm.get('birthDate'); }
  get gender() { return this.profileForm.get('gender'); }
}
