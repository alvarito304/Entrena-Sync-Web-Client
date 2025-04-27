import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-men-back-body-svg',
  standalone: true,
  templateUrl: './men-back-body-svg.component.html',
  styleUrls: ['./men-back-body-svg.component.css']
})
export class MenBackBodySvgComponent {
  @Output() pieceClick = new EventEmitter<Event>();

  onSvgClick(event: Event): void {
    this.pieceClick.emit(event);
  }
}
