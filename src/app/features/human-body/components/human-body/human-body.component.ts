import { Component } from '@angular/core';
import { MenBodySvgComponent } from '../men-body-svg/men-body-svg.component';
import { MenBackBodySvgComponent } from '../men-back-body-svg/men-back-body-svg.component';
import {Router} from '@angular/router';
import {ExerciseListComponent} from '../exercise-list/exercise-list.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {ExerciseService} from '../../services/exercise.service';
import {Exercise} from '../../../../core/models/exercise/exercise';
import {catchError, Observable, of} from 'rxjs';

@Component({
  selector: 'app-human-body',
  standalone: true,
  imports: [MenBodySvgComponent, MenBackBodySvgComponent, ExerciseListComponent, NgIf, AsyncPipe],
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent {
  selectedArea: string = '';
  exercises$!: Observable<Exercise[]>;

  constructor(private exerciseService: ExerciseService) {}

  handlePieceClick(event: any): void {
    // Si el elemento tiene la clase no-click, no se hace nada.
    if (event.target.classList && event.target.classList.contains('no-click')) {
      return;
    }
    // Obtener el data-position
    const position = event.target.getAttribute('data-position') || event.target.parentElement?.getAttribute('data-position');
    if (!position) {
      return;
    }
    this.selectedArea = position;
    this.exercises$ = this.exerciseService.getExercises(this.selectedArea).pipe(catchError(() => of([])));
    }
}

