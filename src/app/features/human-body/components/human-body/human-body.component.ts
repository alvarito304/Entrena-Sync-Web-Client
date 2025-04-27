import { Component } from '@angular/core';
import { MenBodySvgComponent } from '../men-body-svg/men-body-svg.component';
import { MenBackBodySvgComponent } from '../men-back-body-svg/men-back-body-svg.component';
import {Router} from '@angular/router';
import {ExerciseListComponent} from '../exercise-list/exercise-list.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-human-body',
  standalone: true,
  imports: [MenBodySvgComponent, MenBackBodySvgComponent, ExerciseListComponent, NgIf],
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent {
  selectedArea: string = '';

  constructor(private router: Router) {}

  handlePieceClick(event: any): void {
    // Si el elemento tiene la clase no-click, no se hace nada.
    if (event.target.classList && event.target.classList.contains('no-click')) {
      return;
    }
    // Obtener el data-position
    const position =
      event.target.getAttribute('data-position') ||
      event.target.parentElement?.getAttribute('data-position');
    if (!position) {
      return;
    }
      this.selectedArea = position;
    }
}

