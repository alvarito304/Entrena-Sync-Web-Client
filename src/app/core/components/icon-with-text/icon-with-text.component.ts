import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-with-text',
  imports: [],
  templateUrl: './icon-with-text.component.html',
  standalone: true,
  styleUrl: './icon-with-text.component.css'
})
export class IconWithTextComponent {
  @Input() icon!: string;
  @Input() text!: string;
}
