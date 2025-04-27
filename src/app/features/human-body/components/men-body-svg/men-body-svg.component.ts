import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-men-body-svg',
  standalone: true,
  templateUrl: './men-body-svg.component.html',
  styleUrls: ['./men-body-svg.component.css']
})
export class MenBodySvgComponent {
  @Output() pieceClick = new EventEmitter<Event>();

  onSvgClick(event: Event): void {
    this.pieceClick.emit(event);
  }
}
