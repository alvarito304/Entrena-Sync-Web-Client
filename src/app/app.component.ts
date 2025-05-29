import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import {NgIf} from '@angular/common';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, NgIf, Toast],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent {
  title = 'Entrena-Sync-Web-Client';

  constructor(public router: Router) {}

  shouldShowLayout(): boolean {
    const noLayoutRoutes = ['/login', '/register', "/adminpanel", "/edit-profile"];
    return !noLayoutRoutes.some(path => this.router.url.startsWith(path));
  }
}
