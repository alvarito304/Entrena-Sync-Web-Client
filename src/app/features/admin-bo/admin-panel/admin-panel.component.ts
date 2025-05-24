import { Component } from '@angular/core';
import {AuthService, UserResponse} from '../../keycloak/services/auth.service';
import {AdminPanelService} from '../services/admin-panel.service';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  imports: [
    Menu
  ],
  templateUrl: './admin-panel.component.html',
  standalone: true,
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  user: UserResponse | null = null;
  userPhotoUrl: string | null = null;

  constructor(private adminPanelService: AdminPanelService, private authService: AuthService, private router: Router) {
  }

  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.authService.getUserInfo().subscribe(user => {
      this.user = user;
      if (user && user.id) {
        this.adminPanelService.getUserPhotoUrl().subscribe(res => {
          this.userPhotoUrl = res.secure_url;
        });
      }
    });

    this.menuItems = [
      {
        label: 'Ver perfil',
        icon: 'pi pi-user',
        command: () => {
          console.log('Ver perfil');
          this.router.navigate(['/edit-profile']);
        }
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
        }
      }
    ];
  }
}
