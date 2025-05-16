import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { GenericTableComponent } from '../../../../core/components/generic-table/generic-table.component'
import { Exercise } from '../../../../core/models/exercise/exercise';
import {ExerciseService} from '../../../human-body/services/exercise.service';
import {Column} from '../../../../core/models/colum/column';
import {catchError, finalize, of, tap, throwError} from 'rxjs';
import {ExerciseCreateRequest} from '../../../../core/models/exercise/exercise-create-request';
import {ExerciseUpdateRequest} from '../../../../core/models/exercise/exercise-update-request';
import {Toast} from 'primeng/toast';
import {InputTextarea} from 'primeng/inputtextarea';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'app-exercise-table',
  template: `
    <p-toast />
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
      [isFormValid]="isFormValid"
      [loading]="loading"
      (onSave)="saveExercise($event)"
      (onDelete)="deleteExercise($event)"
      (onDeleteMultiple)="deleteSelectedExercises($event)"
      (onImportItems)="importExercises($event)"
    >
      <ng-template #formTemplate let-exercise>



        <form [formGroup]="exerciseForm" (ngSubmit)="saveExercise(exercise)">
          <div>
            <label for="name" class="block font-bold mb-2">Name</label>
            <input type="text" pInputText id="name" [(ngModel)]="exercise.name" formControlName="name" required />
            <div *ngIf="exerciseForm.get('name')?.hasError('required') && exerciseForm.get('name')?.touched">
              <p class="text-red-500 tex-sm mt-1">
                el campo nombre es obligatorio
              </p>
            </div>
          </div>

          <div>
            <label for="description" class="block font-bold mb-2">Description</label>
            <textarea pInputTextarea id="description" [(ngModel)]="exercise.description" formControlName="description"></textarea>
            <div *ngIf="exerciseForm.get('description')?.hasError('required') && exerciseForm.get('description')?.touched">
              <p class="text-red-500 tex-sm mt-1">
                el campo descripción es obligatorio
              </p>
            </div>
          </div>

          <div>
            <label for="bodyPart" class="block font-bold mb-2">Body Part</label>
            <input type="text" pInputText id="bodyPart" [(ngModel)]="exercise.bodyPart" formControlName="bodyPart" required />
            <div *ngIf="exerciseForm.get('bodyPart')?.hasError('required') && exerciseForm.get('bodyPart')?.touched">
              <p class="text-red-500 tex-sm mt-1">
                el campo parte del cuerpo es obligatorio
              </p>
            </div>
          </div>

          <div>
            <label for="muscleGroup" class="block font-bold mb-2">Muscle Group</label>
            <input type="text" pInputText id="muscleGroup" [(ngModel)]="exercise.muscleGroup" formControlName="muscleGroup" required />
            <div *ngIf="exerciseForm.get('muscleGroup')?.hasError('required') && exerciseForm.get('muscleGroup')?.touched">
              <p class="text-red-500 tex-sm mt-1">
                el campo grupo muscular es obligatorio
              </p>
            </div>
          </div>

          <div>
            <label for="equipment" class="block font-bold mb-2">Equipment</label>
            <input type="text" pInputText id="equipment" [(ngModel)]="exercise.equipment" formControlName="equipment" />
          </div>

          <div>
            <label for="caloriesBurned" class="block font-bold mb-2">Calories Burned</label>
            <p-inputNumber id="caloriesBurned" formControlName="caloriesBurned" [(ngModel)]="exercise.caloriesBurned" [showButtons]="true" [min]="0"></p-inputNumber>
            <div *ngIf="exerciseForm.get('caloriesBurned')?.hasError('required') && exerciseForm.get('caloriesBurned')?.touched">
              <p class="text-red-500 tex-sm mt-1">
                el campo calorías quemadas es obligatorio
              </p>
            </div>
          </div>

          <div>
            <label for="difficulty" class="block font-bold mb-2">Difficulty</label>
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center">
                <p-radioButton name="difficulty" value="BEGINNER" [(ngModel)]="exercise.difficulty" formControlName="difficulty" inputId="diff1"></p-radioButton>
                <label for="diff1" class="ml-2">Beginner</label>
              </div>
              <div class="flex align-items-center">
                <p-radioButton name="difficulty" value="INTERMEDIATE" [(ngModel)]="exercise.difficulty" formControlName="difficulty" inputId="diff2"></p-radioButton>
                <label for="diff2" class="ml-2">Intermediate</label>
              </div>
              <div class="flex align-items-center">
                <p-radioButton name="difficulty" value="ADVANCED" [(ngModel)]="exercise.difficulty" formControlName="difficulty" inputId="diff3"></p-radioButton>
                <label for="diff3" class="ml-2">Advanced</label>
              </div>
            </div>
            <div *ngIf="exerciseForm.get('difficulty')?.hasError('required') && exerciseForm.get('difficulty')?.touched">
              <p class="text-red-500 tex-sm mt-1">
                el campo dificultad es obligatorio
              </p>
            </div>
          </div>

          <div>
            <label for="videoUrl" class="block font-bold mb-2">Video URL</label>
            <input type="text" pInputText [(ngModel)]="exercise.videoUrl" id="videoUrl" formControlName="videoUrl" />
          </div>

          <div>
            <p-fileupload
              mode="basic"
              name="video"
              chooseIcon="pi pi-upload"
              accept="video/mp4,video/avi,video/mov,video/mkv,video/wmv"
              maxFileSize="50000000"
              formControlName="video"
            [auto]="false"
            chooseLabel="Seleccionar Video"
            (onSelect)="onSelectFile($event)"
            />
          </div>
        </form>
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
    ReactiveFormsModule,
    Toast,
    InputTextarea,
    FileUpload,
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
  isFormValid: boolean = false;
  selectedFile?: File;
  loading = false;

  exerciseForm!: FormGroup;
  currentExercise: Exercise | null = null;

  constructor(private exerciseService: ExerciseService, private fb: FormBuilder, private messageService: MessageService,) {}

  ngOnInit() {
    this.setupColumns();
    this.loadExercises();
    this.initForm();

    this.exerciseForm.statusChanges.subscribe((status) => {
      this.isFormValid = status === 'VALID';
    });


  }

  initForm(exercise?: ExerciseCreateRequest) {
    this.exerciseForm = this.fb.group({
      name: [exercise?.name || '', Validators.required],
      description: [exercise?.description || '', Validators.required],
      bodyPart: [exercise?.bodyPart || '', Validators.required],
      muscleGroup: [exercise?.muscleGroup || '',Validators.required],
      equipment: [exercise?.equipment || ''],
      caloriesBurned: [exercise?.caloriesBurned || 0, Validators.required],
      difficulty: [exercise?.difficulty || 'BEGINNER', Validators.required],
      videoUrl: [exercise?.videoUrl || ''],
      video: [null],
    });
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
    if (!this.exerciseForm.valid) {
      return;
    }

    // 1. Construye el DTO a partir del formGroup
    const dto: ExerciseUpdateRequest = { ...this.exerciseForm.value };

    // 2. Monta el FormData con un sólo part JSON
    const form = new FormData();
    form.append(
      'exercise',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );

    // 3. (Opcional) adjunta el fichero si existe
    if (this.selectedFile) {
      form.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.loading = true;

    // 4. Llama al servicio
    if (ex.id) {
      this.exerciseService.updateExercise(ex.id, form)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Ejercicio actualizado correctamente'
            });
            this.loadExercises();
          }),
          catchError(err => {
            const serverMsg = err.error?.message || 'Error desconocido';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar',
              detail: serverMsg
            });
            return throwError(() => err);
          }),
          finalize(() => {
            this.submitted = false;
            this.currentExercise = null;
            this.exerciseForm.reset();
            this.selectedFile = undefined;
            this.loading = false;
          })
        ).subscribe();
    } else {
      // Lógica para crear un nuevo ejercicio
      this.exerciseService.createExercise(form)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Ejercicio creado correctamente'
            });
            this.loadExercises();
          }),
          catchError(err => {
            const serverMsg = err.error?.message || 'Error desconocido';
            this.messageService.add({
              severity: 'error',
              summary: 'Error al crear',
              detail: serverMsg
            });
            return throwError(() => err);
          }),
          finalize(() => {
            this.submitted = false;
            this.currentExercise = null;
            this.exerciseForm.reset();
            this.selectedFile = undefined;
            this.loading = false;
          })
        ).subscribe();
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

  onSelectFile(event: any) {
    const file: File = event.files[0];
    if (!file) return;

    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.src = URL.createObjectURL(file);

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 120) {
        this.messageService.add({ /* …duración err…*/ });
        return;
      }
      // Si pasa validación, guardamos el fichero:
      this.selectedFile = file;
    };
  }

}
