import {Component, OnDestroy, OnInit} from '@angular/core';
import { MenBodySvgComponent } from '../men-body-svg/men-body-svg.component';
import { MenBackBodySvgComponent } from '../men-back-body-svg/men-back-body-svg.component';
import {Router} from '@angular/router';
import {ExerciseListComponent} from '../exercise-list/exercise-list.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {ExerciseService} from '../../services/exercise.service';
import {Exercise} from '../../../../core/models/exercise/exercise';
import {
  BehaviorSubject,
  catchError, combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap
} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-human-body',
  standalone: true,
  imports: [MenBodySvgComponent, MenBackBodySvgComponent, ExerciseListComponent, NgIf, AsyncPipe, FormsModule],
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent implements OnInit, OnDestroy {
  // Streams de estado
  private area$ = new BehaviorSubject<string>('');
  private name$ = new Subject<string>();

  // Observable público que la plantilla consumirá
  exercises$!: Observable<Exercise[]>;

  searchName: string = '';

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    // pipeline de texto: debounce + no duplicados
    const debouncedName$ = this.name$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );

    // combinar área y texto: cada cambio en uno u otro dispara consulta
    this.exercises$ = combineLatest([ this.area$, debouncedName$ ]).pipe(
      switchMap(([ area, name ]) =>
        this.exerciseService
          .getExercises(area, name)   // params dinámicos
          .pipe(catchError(() => of([])))
      )
    );
  }

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
    this.area$.next(position);
    this.name$.next(this.searchName);
  }

  onSearchName(): void {
    this.name$.next(this.searchName);
  }

  ngOnDestroy(): void {
    this.area$.complete();
    this.name$.complete();
  }
}

