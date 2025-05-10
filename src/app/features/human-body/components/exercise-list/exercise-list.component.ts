import { Component, Input } from '@angular/core';
import {Exercise} from '../../../../core/models/exercise/exercise';
import {NgClass, NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
})
export class ExerciseListComponent {
  @Input() exercises: Exercise[] = [];
  @Input() area!: string | null;

}
