import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm, NgModel} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {Steps} from 'primeng/steps';
import {FileUpload} from 'primeng/fileupload';
import {DropdownModule} from 'primeng/dropdown';
import {Calendar} from 'primeng/calendar';
import {IftaLabelModule} from 'primeng/iftalabel';
import {DatePicker} from "primeng/datepicker";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-sign-in',
    imports: [CommonModule, IftaLabelModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, RouterLink, Steps, FileUpload, DropdownModule, Calendar, DatePicker],
  templateUrl: './sign-in.component.html',
  standalone: true,
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
  }
  activeIndex = 0;
  items: MenuItem[] = [
    { label: 'Cuenta' },
    { label: 'Perfil' }
  ];

  // Campos
  username = '';
  email = '';
  password = '';
  passwordConfirmation = '';

  firstName = '';
  lastName = '';
  address = '';
  countryCode = '+34';
  phone = '';
  birthDate: Date | null = null;
  gender = '';
  avatarPreview: string | ArrayBuffer | null = null;
  avatarFile: File | null = null;

  countryCodes = [
    { label: '+34 ES', value: '+34' },
  ];
  genders = [
    { label: 'Femenino', value: 'Femenino' },
    { label: 'Masculino', value: 'Masculino' },
  ];

  goToNextStep(form: NgForm) {
    if (this.activeIndex === 0) {
      form.controls['username']?.markAsTouched();
      form.controls['email']?.markAsTouched();
      form.controls['password']?.markAsTouched();
      form.controls['passwordConfirmation']?.markAsTouched();

      const passwordsMatch = this.password === this.passwordConfirmation;

      if (form.controls['username']?.invalid ||
          form.controls['email']?.invalid ||
          form.controls['password']?.invalid ||
          form.controls['passwordConfirmation']?.invalid ||
          !passwordsMatch) {
        return;
      }
    }
    this.activeIndex++;
  }

  private isAdult(birthDate: Date): boolean {
    const today = new Date();
    const adultDate = new Date(
        birthDate.getFullYear() + 18,
        birthDate.getMonth(),
        birthDate.getDate()
    );
    return today >= adultDate;
  }
  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  onAvatarChange(event: { files: File[] }) {
    const file = event.files[0];
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview = reader.result;
    reader.readAsDataURL(file);
  }

  submit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.birthDate || !this.isAdult(this.birthDate)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Edad inválida',
        detail: 'Debes ser mayor de edad para registrarte.',
        life: 4000
      });
      return;
    }

    const userRequest = {
      username: this.username,
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
      firstName: this.firstName,
      lasName: this.lastName,
    };

    // Formatear fecha de nacimiento (a ISO string por ejemplo)
    const birthDateFormatted = this.birthDate ? this.birthDate.toISOString().split('T')[0] : '';

    const clientRequest = {
      name: this.firstName,
      surname: this.lastName,
      address: this.address,
      phone: `${this.countryCode} ${this.phone}`,
      birthDate: birthDateFormatted,
      gender: this.gender,
      userId: ''
    };

    this.authService.register(userRequest, clientRequest).subscribe({
      next: () => {
        console.log('Usuario y cliente creados correctamente');
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Tu cuenta ha sido creada correctamente.',
          life: 3000
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Registro fallido',
          detail: err?.error?.message || 'No se pudo completar el registro. Intenta más tarde.',
          life: 5000
        });
      }
    });
  }

}
