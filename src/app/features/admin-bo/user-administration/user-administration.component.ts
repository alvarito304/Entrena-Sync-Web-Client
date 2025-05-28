import { Component } from '@angular/core';
import {AdminPanelService, CombinedUserClient} from '../services/admin-panel.service';
import {AuthService, UserResponse} from '../../keycloak/services/auth.service';
import {Router} from '@angular/router';
import {GenericTableComponent} from '../../../core/components/generic-table/generic-table.component';
import {FormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {Dialog} from 'primeng/dialog';
import {PrimeTemplate} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-user-administration',
  imports: [
    GenericTableComponent,
    FormsModule,
    MultiSelect,
    Dialog,
    PrimeTemplate,
    ButtonDirective,
    NgTemplateOutlet,
    NgIf,
    InputText,
    DatePicker,
    DropdownModule
  ],
  templateUrl: './user-administration.component.html',
  standalone: true,
  styleUrl: './user-administration.component.css'
})
export class UserAdministrationComponent {
  constructor(private adminPanelService: AdminPanelService, private router: Router) {
  }
  cols = [
    { field: 'email', header: 'Email' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'address', header: 'Address' },
    { field: 'phone', header: 'Phone' },
    { field: 'birthDate', header: 'Birth Date' },
    { field: 'gender', header: 'Gender' },
  ];
  page = 0;

  genders = [
    { label: 'Femenino', value: 'Femenino' },
    { label: 'Masculino', value: 'Masculino' },
  ];

  size = 5;
  totalElements = 0;
  displayDialog = false;

  current: UserResponse | null = null;
  isNew = false;

  users: UserResponse[] = [];
  combinedUsers: CombinedUserClient[] = [];

  ngOnInit() {
    this.loadCombinedUsers(this.page, this.size);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  loadCombinedUsers(page: number, size: number) {
    this.adminPanelService.getUsers(page, size).subscribe(userPaged => {
      const users = userPaged.content;

      this.adminPanelService.getClients().subscribe(clients => {
        this.combinedUsers = users.map(user => {
          const client = clients.find(c => c.userId === user.id);
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: client?.address,
            phone: client?.phone.trim(),
            birthDate: client?.birthDate ? this.formatDate(client.birthDate) : undefined,
            gender: client?.gender
          };
        });
        console.log('combinedUsers:', this.combinedUsers);
        this.page = userPaged.page;
        this.size = userPaged.size;
        this.totalElements = userPaged.totalElements;
      });
    });
  }

  onPageChange(event: any) {
    this.loadCombinedUsers(event.page, event.rows);
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
