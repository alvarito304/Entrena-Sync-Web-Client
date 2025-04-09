import { Component,Input } from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-primary-button',
  imports: [
    Button
  ],
  templateUrl: './primary-button.component.html',
  standalone: true,
  styleUrl: './primary-button.component.css'
})
export class PrimaryButtonComponent {
@Input() text = '';
}
