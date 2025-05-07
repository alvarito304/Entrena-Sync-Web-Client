import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {Steps} from 'primeng/steps';
import {FileUpload} from 'primeng/fileupload';
import {DropdownModule} from 'primeng/dropdown';
import {Calendar} from 'primeng/calendar';
import {IftaLabelModule} from 'primeng/iftalabel';
import {DatePicker} from "primeng/datepicker";

@Component({
  selector: 'app-sign-in',
    imports: [CommonModule, IftaLabelModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, RouterLink, Steps, FileUpload, DropdownModule, Calendar, DatePicker],
  templateUrl: './sign-in.component.html',
  standalone: true,
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
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
    { label: '+1 US', value: '+1' },
    { label: '+52 MX', value: '+52' }
  ];
  genders = [
    { label: 'Femenino', value: 'F' },
    { label: 'Masculino', value: 'M' },
  ];

  next() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    }
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

  submit() {
    // lógica de envío
    console.log({
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      phone: `${this.countryCode} ${this.phone}`,
      birthDate: this.birthDate,
      gender: this.gender,
      avatar: this.avatarFile
    });
  }
}
