import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonDirective} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService, LoginResponse} from './services/auth.service';

@Component({
  selector: 'app-keycloak',
  imports: [CommonModule, FormsModule, InputText, PasswordModule, ButtonDirective, RouterLink],
  templateUrl: './keycloak.component.html',
  standalone: true,
  styleUrl: './keycloak.component.css'
})
export class KeycloakComponent {

  password: string = "";
  email: string = "";

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        const token = response.access_token;
        if (token) {
          localStorage.setItem('access_token', token);
          console.log('Login successful. Token stored.');
          this.router.navigate(['/human-body']);
        } else {
          console.warn('Login response does not contain a token.');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Credenciales incorrectas o error en el servidor');
      }
    });
  }
}
