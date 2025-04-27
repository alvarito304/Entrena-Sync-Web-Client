import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {catchError, Observable, of, tap} from 'rxjs';
import { Exercise } from '../../../../core/models/exercise/exercise';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseListComponent implements OnChanges {
  @Input() area!: string;
  exercises$!: Observable<Exercise[]>;

  constructor(private exerciseService: ExerciseService) {}

  ngOnChanges(): void {
    this.exercises$ = this.exerciseService.getExercises(this.area).pipe(
      catchError(err => { console.error(err); return of([]); })
    );
  }
}
