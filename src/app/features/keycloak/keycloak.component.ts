import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonDirective} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {IftaLabel} from 'primeng/iftalabel';
import {AuthService} from './services/auth.service';
import {MessageService} from 'primeng/api';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-keycloak',
  imports: [CommonModule, FormsModule, InputText, PasswordModule, ButtonDirective, RouterLink, IftaLabel],
  templateUrl: './keycloak.component.html',
  standalone: true,
  styleUrl: './keycloak.component.css'
})
export class KeycloakComponent {

  password: string = "";
  email: string = "";

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      console.warn('Formulario inválido');
      return;
    }

    console.log('Iniciando login con:', this.email);

    this.authService.login(this.email, this.password).pipe(
      switchMap(() => {
        console.log('Login OK, token debería estar en cookies');
        return this.authService.getUserInfo(); // ← debe devolver roles
      })
    ).subscribe({
      next: (user) => {
        console.log('User recibido:', user);
        console.log('Roles:', (user as any).roles);

        if ((user as any)?.roles?.includes('admin')) {
          this.router.navigate(['/admin-panel']);
        } else {
          this.router.navigate(['/human-body']);
        }
      },
      error: (err) => {
        console.error('Error durante el login o al obtener el usuario:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al iniciar sesión',
          detail: err?.error?.message || 'Credenciales incorrectos',
          life: 5000
        });
      }
    });
  }
}
