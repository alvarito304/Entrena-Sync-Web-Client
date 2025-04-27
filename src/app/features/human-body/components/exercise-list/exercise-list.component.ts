import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../../../core/models/exercise/exercise';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseListComponent {
  @Input() exercises: Exercise[] = [];
}
