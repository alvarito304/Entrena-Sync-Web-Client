import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-keycloak',
  imports: [CommonModule, FormsModule, InputText, PasswordModule, ButtonDirective],
  templateUrl: './keycloak.component.html',
  standalone: true,
  styleUrl: './keycloak.component.css'
})
export class KeycloakComponent {

  password: string ="";
  email: string = "";


}
