import { Component } from '@angular/core';
import {FeaturesSectionComponent} from '../../features-section/features-section.component';
import {HeroComponent} from '../../components/hero/hero.component';

@Component({
  selector: 'app-home',
  imports: [
    FeaturesSectionComponent,
    HeroComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
