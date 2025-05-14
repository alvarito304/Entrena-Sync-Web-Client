import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { GenericTableComponent, Column } from '../../../../core/components/generic-table/generic-table.component'
import { Exercise } from '../../../../core/models/exercise/exercise';
import {ExerciseService} from '../../../human-body/services/exercise.service';

@Component({
  selector: 'app-exercise-table',
  template: `
    <div class="m-20">
    <generic-table
      [items]="exercises"
      [cols]="cols"
      [globalFilterFields]="['name', 'bodyPart']"
      [title]="'Manage Exercises'"
      [entityName]="'exercises'"
      [idField]="'id'"
      [nameField]="'name'"
      [severityMap]="severityMap"
      (onSave)="saveExercise($event)"
      (onDelete)="deleteExercise($event)"
      (onDeleteMultiple)="deleteSelectedExercises($event)"
      (onImportItems)="importExercises($event)"
    >
      <ng-template #formTemplate let-exercise>
        <div *ngIf="exercise.gifUrl">
          <img [src]="exercise.gifUrl" [alt]="exercise.name" class="block m-auto pb-4" style="max-width:150px" />
        </div>

        <div>
          <label for="name" class="block font-bold mb-2">Name</label>
          <input type="text" pInputText id="name" [(ngModel)]="exercise.name" required />
          <small class="text-red-500" *ngIf="submitted && !exercise.name">Name is required.</small>
        </div>

        <div>
          <label for="bodyPart" class="block font-bold mb-2">Body Part</label>
          <input type="text" pInputText id="bodyPart" [(ngModel)]="exercise.bodyPart" required />
        </div>

        <div>
          <label for="target" class="block font-bold mb-2">Target Muscle</label>
          <input type="text" pInputText id="target" [(ngModel)]="exercise.target" required />
        </div>
      </ng-template>
    </generic-table>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GenericTableComponent,
    ButtonModule,
    InputTextModule,
    RatingModule,
    SelectModule,
    TextareaModule,
    RadioButtonModule,
    InputNumberModule,
  ],
  providers: [MessageService, ExerciseService]
})
export class ExercisesControllPanelComponent implements OnInit {
  exercises: Exercise[] = [];
  submitted: boolean = false;
  cols: Column[] = [];
  severityMap: { [key: string]: string } = {
    'BEGINNER': 'success',
    'INTERMEDIATE': 'info',
    'ADVANCED': 'danger'
  };

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.setupColumns();
    this.loadExercises();
  }

  setupColumns() {
    this.cols = [
      { field: 'name', header: 'Name', style: 'min-width: 16rem' },
      { field: 'description', header: 'Description', style: 'min-width: 16rem' },
      { field: 'bodyPart', header: 'Body Part', style: 'min-width: 12rem' },
      { field: 'muscleGroup', header: 'Muscle Group', style: 'min-width: 12rem' },
      { field: 'equipment', header: 'Equipment', style: 'min-width: 8rem' },
      { field: 'caloriesBurned', header: 'Calories Burned', type: 'rating', style: 'min-width: 8rem' },
      { field: 'difficulty', header: 'Difficulty', type:"tag", style: 'min-width: 12rem' },
      { field: 'videoUrl', header: 'VideoUrl', type: 'text', style: 'min-width: 16rem' },
    ];
  }

  loadExercises() {
    this.exerciseService.getExercisesWithFilters({}).subscribe((res) => {
      this.exercises = res.exercises;
    });
  }

  saveExercise(ex: Exercise) {
    this.submitted = true;
    if (!ex.name) return;

    if (ex.id) {
      this.exerciseService.updateExercise(ex.id, ex).subscribe(() => this.loadExercises());
    } else {
      this.exerciseService.createExercise(ex).subscribe(() => this.loadExercises());
    }
  }

  deleteExercise(ex: Exercise) {
    if (!ex.id) return;
    this.exerciseService.deleteExercise(ex.id).subscribe(() => this.loadExercises());
  }

  deleteSelectedExercises(selected: Exercise[]) {
    selected.forEach(ex => this.deleteExercise(ex));
  }

  importExercises(event: any) {
    // Implement import logic or skip if not needed
    console.log('Import not implemented', event);
  }
}
