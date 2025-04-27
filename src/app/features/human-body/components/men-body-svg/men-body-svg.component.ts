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

/*

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-men-body-svg',
  standalone: true,
  templateUrl: './men-body-svg.component.html',
  styleUrls: ['./men-body-svg.component.css']
})
export class MenBodySvgComponent {
  selectedArea: string = '';

  handlePieceClick(event: MouseEvent): void {
    // Obtiene el atributo 'data-position' del elemento clickeado o su contenedor
    const target = event.target as HTMLElement;
    const position = target.getAttribute('data-position') ||
      target.parentElement?.getAttribute('data-position');
    if (position) {
      this.selectedArea = position;
    }
  }
}
*/
