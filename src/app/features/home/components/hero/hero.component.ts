import { Component } from '@angular/core';
import {PrimaryButtonComponent} from '../../../../core/components/primary-button/primary-button.component';
import {SecondaryButtonComponent} from '../../../../core/components/secondary-button/secondary-button.component';
import {IconWithTextComponent} from '../../../../core/components/icon-with-text/icon-with-text.component';

@Component({
  selector: 'app-hero',
  imports: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    IconWithTextComponent
  ],
  templateUrl: './hero.component.html',
  standalone: true,
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
