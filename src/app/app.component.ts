import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MessageService} from 'primeng/api';
import {FeaturesSectionComponent} from './features/home/features-section/features-section.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {HeaderComponent} from './shared/components/header/header.component';
import {HeroComponent} from './features/home/components/hero/hero.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent {
  title = 'Entrena-Sync-Web-Client';
}
