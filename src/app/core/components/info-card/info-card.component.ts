import {Component, Input} from '@angular/core';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-info-card',
  imports: [
  ],
  templateUrl: './info-card.component.html',
  standalone: true,
  styleUrl: './info-card.component.css'
})
export class InfoCardComponent {
@Input() icon: string = '';
@Input() title: string = '';
@Input() content: string = '';
}
