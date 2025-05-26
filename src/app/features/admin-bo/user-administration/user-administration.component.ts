import { Component } from '@angular/core';
import {AdminPanelService} from '../services/admin-panel.service';
import {AuthService, UserResponse} from '../../keycloak/services/auth.service';
import {Router} from '@angular/router';
import {GenericTableComponent} from '../../../core/components/generic-table/generic-table.component';
import {FormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {Dialog} from 'primeng/dialog';
import {PrimeTemplate} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-user-administration',
  imports: [
    GenericTableComponent,
    FormsModule,
    MultiSelect,
    Dialog,
    PrimeTemplate,
    ButtonDirective,
    NgTemplateOutlet
  ],
  templateUrl: './user-administration.component.html',
  standalone: true,
  styleUrl: './user-administration.component.css'
})
export class UserAdministrationComponent {
  constructor(private adminPanelService: AdminPanelService, private router: Router) {
  }
  users: UserResponse[] = [];
  cols = [
    { field: 'username', header: 'Username' },
    { field: 'email', header: 'Email' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'roles', header: 'Roles' },
  ];


  page = 0;
  size = 5;
  totalElements = 0;

  displayDialog = false;
  current: UserResponse | null = null;
  isNew = false;

  ngOnInit() {
    this.loadUsers(this.page, this.size);
  }

  loadUsers(page: number, size: number) {
    this.adminPanelService.getUsers(page, size).subscribe(response => {
      this.users = response.content;
      this.page = response.page;
      this.size = response.size;
      this.totalElements = response.totalElements;
    });
  }

  onPageChange(event: any) {
    this.loadUsers(event.page, event.rows);
  }

  showEditDialog(user: UserResponse) {
    this.current = { ...user };
    this.isNew = false;
    this.displayDialog = true;
  }

  deleteUser(user: UserResponse) {
    // Aquí puedes invocar tu servicio para eliminar
    console.log('Delete user', user);
  }

  deleteSelectedUsers(users: UserResponse[]) {
    console.log('Delete multiple users', users);
  }

  save() {
    if (this.current) {
      // Guardar o actualizar el usuario actual
      console.log('Saving user', this.current);
      this.displayDialog = false;
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.current = null;
  }

}
