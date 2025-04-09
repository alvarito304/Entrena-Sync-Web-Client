import { Component, Input } from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-secondary-button',
  imports: [
    Button
  ],
  templateUrl: './secondary-button.component.html',
  standalone: true,
  styleUrl: './secondary-button.component.css'
})
export class SecondaryButtonComponent {
  @Input() text: string = '';
}
