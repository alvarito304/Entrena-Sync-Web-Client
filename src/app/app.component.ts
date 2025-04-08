import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent {
  title = 'Entrena-Sync-Web-Client';
}
