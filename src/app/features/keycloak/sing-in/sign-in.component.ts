import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {Steps} from 'primeng/steps';
import {DropdownModule} from 'primeng/dropdown';
import {IftaLabelModule} from 'primeng/iftalabel';
import {DatePicker} from "primeng/datepicker";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-sign-in',
    imports: [CommonModule, IftaLabelModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, Steps, DropdownModule, DatePicker],
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

  isLoading = false;

  // Campos
  email = '';
  password = '';
  passwordConfirmation = '';

  firstName = '';
  lastName = '';
  address = '';
  countryCode = '+34';
  phone = '';
  birthDate: Date | null = null;
  gender: string | { label: string; value: string } = '';


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

  isAdult(birthDate: Date): boolean {
    if (!birthDate) return true;
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return birthDate <= eighteenYearsAgo;
  }
  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  submit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    console.log("Empezando sign in");
    console.log(this.birthDate);
    if (!this.birthDate || !this.isAdult(this.birthDate)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Edad inválida',
        detail: 'Debes ser mayor de edad para registrarte.',
        life: 4000
      });
      return;
    }
    this.isLoading = true;
    const userRequest = {
      username: this.email,
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
      firstName: this.firstName,
      lastName: this.lastName,
      type: 'client',
      roles: ['Client']
    };
    const birthDateFormatted = this.birthDate ? this.birthDate.toISOString().split('T')[0] : '';
    console.log('Fecha de nacimiento formateada:', birthDateFormatted);
    const clientRequest = {
      name: this.firstName,
      address: this.address,
      phone: `${this.countryCode} ${this.phone}`,
      birthDate: birthDateFormatted,
      gender: typeof this.gender === 'object' ? this.gender.value : this.gender,
      userId: '',
      avatar: "undefinedAvatar_w8za89",
    };

    this.authService.register(userRequest, clientRequest).subscribe({
      next: () => {
        this.isLoading = false;
        console.log('Usuario y cliente creados correctamente');
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Tu cuenta ha sido creada correctamente.',
          life: 3000
        });
        this.router.navigate(['/human-body']);
      },
      error: (err) => {
        this.isLoading = false;
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
