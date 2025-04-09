import { Component } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {SecondaryButtonComponent} from '../../../core/components/secondary-button/secondary-button.component';
import {PrimaryButtonComponent} from '../../../core/components/primary-button/primary-button.component';
import {InfoCardComponent} from '../../../core/components/info-card/info-card.component';

@Component({
  selector: 'app-features-section',
  imports: [
    InfoCardComponent
  ],
  templateUrl: './features-section.component.html',
  standalone: true,
  styleUrl: './features-section.component.css'
})
export class FeaturesSectionComponent {

}
