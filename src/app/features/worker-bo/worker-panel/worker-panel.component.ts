import { Component } from '@angular/core';
import {AuthService, UserResponse} from '../../keycloak/services/auth.service';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AdminPanelService} from '../../admin-bo/services/admin-panel.service';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'app-worker-panel',
  imports: [
    Menu,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './worker-panel.component.html',
  standalone: true,
  styleUrl: './worker-panel.component.css'
})
export class WorkerPanelComponent {
  user: UserResponse | null = null;
  userPhotoUrl: string | null = null;

  constructor(private adminPanelService: AdminPanelService, private authService: AuthService, private router: Router) {
  }

  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.authService.getUserInfo().subscribe(user => {
      this.user = user;
      if (user && user.id) {
        this.adminPanelService.getWorkerByUserId(user.id).subscribe(res => {
          if (res.avatar) {
            this.adminPanelService.getUserPhotoUrl(res.avatar).subscribe(photo => {
              this.userPhotoUrl = photo.secure_url;
            });
          }
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
