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
    ><ng-template #formTemplate let-exercise>



      <form [formGroup]="exerciseForm" (ngSubmit)="saveExercise(exercise)">
        <!-- Capa Acrylic para gradiente suave -->

        <!-- Contenido del formulario -->

        <!-- Grid de campos del formulario -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Columna izquierda -->
          <div class="space-y-5">
            <!-- Nombre -->
            <div class="space-y-2">
              <label for="name" class="block font-medium text-gray-800 dark:text-gray-200">Name</label>
              <input type="text" pInputText id="name" [(ngModel)]="exercise.name" formControlName="name" required
                     class="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/60 focus:border-primary" />
              <div *ngIf="exerciseForm.get('name')?.hasError('required') && exerciseForm.get('name')?.touched"
                   class="transform origin-top-left transition-all duration-200 animate-fade-slide-in">
                <p class="text-red-500 text-sm mt-1">
                  El campo nombre es obligatorio
                </p>
              </div>
            </div>

            <!-- Descripción -->
            <div class="space-y-2">
              <label for="description" class="block font-medium text-gray-800 dark:text-gray-200">Description</label>
              <textarea pInputTextarea id="description" [(ngModel)]="exercise.description" formControlName="description"
                        class="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/60 focus:border-primary"></textarea>
              <div *ngIf="exerciseForm.get('description')?.hasError('required') && exerciseForm.get('description')?.touched"
                   class="transform origin-top-left transition-all duration-200 animate-fade-slide-in">
                <p class="text-red-500 text-sm mt-1">
                  El campo descripción es obligatorio
                </p>
              </div>
            </div>

            <!-- Parte del cuerpo -->
            <div class="space-y-2">
              <label for="bodyPart" class="block font-medium text-gray-800 dark:text-gray-200">Body Part</label>
              <input type="text" pInputText id="bodyPart" [(ngModel)]="exercise.bodyPart" formControlName="bodyPart" required
                     class="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/60 focus:border-primary" />
              <div *ngIf="exerciseForm.get('bodyPart')?.hasError('required') && exerciseForm.get('bodyPart')?.touched"
                   class="transform origin-top-left transition-all duration-200 animate-fade-slide-in">
                <p class="text-red-500 text-sm mt-1">
                  El campo parte del cuerpo es obligatorio
                </p>
              </div>
            </div>

            <!-- Grupo muscular -->
            <div class="space-y-2">
              <label for="muscleGroup" class="block font-medium text-gray-800 dark:text-gray-200">Muscle Group</label>
              <input type="text" pInputText id="muscleGroup" [(ngModel)]="exercise.muscleGroup" formControlName="muscleGroup" required
                     class="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/60 focus:border-primary" />
              <div *ngIf="exerciseForm.get('muscleGroup')?.hasError('required') && exerciseForm.get('muscleGroup')?.touched"
                   class="transform origin-top-left transition-all duration-200 animate-fade-slide-in">
                <p class="text-red-500 text-sm mt-1">
                  El campo grupo muscular es obligatorio
                </p>
              </div>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="space-y-5">
            <!-- Equipamiento -->
            <div class="space-y-2">
              <label for="equipment" class="block font-medium text-gray-800 dark:text-gray-200">Equipment</label>
              <input type="text" pInputText id="equipment" [(ngModel)]="exercise.equipment" formControlName="equipment"
                     class="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/60 focus:border-primary" />
            </div>

            <!-- Calorías quemadas -->
            <div class="space-y-2">
              <label for="caloriesBurned" class="block font-medium text-gray-800 dark:text-gray-200">Calories Burned</label>
              <p-inputNumber id="caloriesBurned" formControlName="caloriesBurned" [(ngModel)]="exercise.caloriesBurned" [showButtons]="true" [min]="0"
                             styleClass="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"></p-inputNumber>
              <div *ngIf="exerciseForm.get('caloriesBurned')?.hasError('required') && exerciseForm.get('caloriesBurned')?.touched"
                   class="transform origin-top-left transition-all duration-200 animate-fade-slide-in">
                <p class="text-red-500 text-sm mt-1">
                  El campo calorías quemadas es obligatorio
                </p>
              </div>
            </div>

            <!-- Dificultad -->
            <div class="space-y-2">
              <label class="block font-medium text-gray-800 dark:text-gray-200">Difficulty</label>
              <div class="p-4 rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                <div class="flex flex-col gap-3">
                  <div class="flex items-center group hover:bg-white/20 dark:hover:bg-gray-700/20 p-2 rounded-md transition-colors duration-200">
                    <p-radioButton name="difficulty" value="BEGINNER" [(ngModel)]="exercise.difficulty" formControlName="difficulty" inputId="diff1"></p-radioButton>
                    <label for="diff1" class="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">Beginner</label>
                  </div>
                  <div class="flex items-center group hover:bg-white/20 dark:hover:bg-gray-700/20 p-2 rounded-md transition-colors duration-200">
                    <p-radioButton name="difficulty" value="INTERMEDIATE" [(ngModel)]="exercise.difficulty" formControlName="difficulty" inputId="diff2"></p-radioButton>
                    <label for="diff2" class="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">Intermediate</label>
                  </div>
                  <div class="flex items-center group hover:bg-white/20 dark:hover:bg-gray-700/20 p-2 rounded-md transition-colors duration-200">
                    <p-radioButton name="difficulty" value="ADVANCED" [(ngModel)]="exercise.difficulty" formControlName="difficulty" inputId="diff3"></p-radioButton>
                    <label for="diff3" class="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">Advanced</label>
                  </div>
                </div>
              </div>
              <div *ngIf="exerciseForm.get('difficulty')?.hasError('required') && exerciseForm.get('difficulty')?.touched"
                   class="transform origin-top-left transition-all duration-200 animate-fade-slide-in">
                <p class="text-red-500 text-sm mt-1">
                  El campo dificultad es obligatorio
                </p>
              </div>
            </div>

            <!-- URL del video -->
            <div class="space-y-2">
              <label for="videoUrl" class="block font-medium text-gray-800 dark:text-gray-200">Video URL</label>
              <input type="text" pInputText [(ngModel)]="exercise.videoUrl" id="videoUrl" formControlName="videoUrl"
                     class="w-full rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/60 focus:border-primary" />
            </div>
          </div>
        </div>

        <!-- Subida de archivo -->
        <div class="mt-6 p-4 rounded-lg border border-white/30 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
          <label class="block font-medium text-gray-800 dark:text-gray-200 mb-2">Upload Video</label>
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
            styleClass="w-full"
          ></p-fileupload>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Máximo 2 minutos de duración. Formatos aceptados: MP4, AVI, MOV, MKV, WMV
          </p>
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
  isFormValid: boolean = false;  selectedFile?: File;
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
    this.loading = true;

    this.exerciseService.getAllExercises().subscribe({
      next: (res) => {
        this.exercises = res;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exercises:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los ejercicios'
        });
        this.loading = false;
      }
    });
  }

  saveExercise(ex: Exercise) {
    this.submitted = true;
    if (!this.exerciseForm.valid) {
      return;
    }

    const dto: ExerciseUpdateRequest = { ...this.exerciseForm.value };

    const form = new FormData();
    form.append(
      'exercise',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );

    if (this.selectedFile) {
      form.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.loading = true;

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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El video no puede durar más de 2 minutos'
        });
        return;
      }
      // Si pasa validación, guardamos el fichero:
      this.selectedFile = file;
    };
  }

}
