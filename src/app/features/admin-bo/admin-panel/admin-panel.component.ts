import { Component } from '@angular/core';
import {AuthService, UserResponse} from '../../keycloak/services/auth.service';
import {AdminPanelService} from '../services/admin-panel.service';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.component.html',
  standalone: true,
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  user: UserResponse | null = null;
  userPhotoUrl: string | null = null;

  constructor(private adminPanelService: AdminPanelService, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(user => {
      this.user = user;
      if (user && user.id) {
        this.adminPanelService.getUserPhotoUrl().subscribe(res => {
          this.userPhotoUrl = res.secure_url;
        });
      }
    });
  }
}
