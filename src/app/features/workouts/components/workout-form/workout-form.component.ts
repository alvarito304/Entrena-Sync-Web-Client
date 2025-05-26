import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { WorkoutService } from '../../service/workouts.service';
import {
  WorkoutResponse,
  WorkoutCreateRequest,
  WorkoutUpdateRequest,
  WorkoutDetailsCreateRequest,
  WorkoutDetailsUpdateRequest
} from '../../../../core/models/workouts/workoutsInterface';
import {ClientService} from '../../../clients/service/clients.service';
import {AuthService} from '../../../keycloak/services/auth.service';
import {ExerciseService} from '../../../human-body/services/exercise.service';
import {Exercise} from '../../../../core/models/exercise/exercise';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './workout-form.component.html',
})
export class WorkoutFormComponent implements OnInit {
  @Input() workout?: WorkoutResponse;
  @Output() close = new EventEmitter<void>();
  @Output() refreshWorkouts = new EventEmitter<number>();

  isEditing = false;
  isSubmitting = false;
  errorMessage = '';

  // Para el autocompletado
  exercises: Exercise[] = [];
  filteredExercisesMap: { [index: number]: Exercise[] } = {};

  // Modelo para el formulario
  formData: {
    name: string;
    trainingDuration: string; // Formato legible (se convertirá a segundos)
    trainingCompletedDate: string;
    completed: boolean;
    description: string;
    intensity: number;
    exerciseListId: Record<string, string>;
    additionalDetails: Record<string, string>;
  } = {
    name: '',
    trainingDuration: '',
    trainingCompletedDate: new Date().toISOString().split('T')[0],
    completed: false, // Por defecto, no completado
    description: '',
    intensity: 5,
    exerciseListId: {},
    additionalDetails: {}
  };

  // Para manejar los ejercicios y detalles adicionales
  exerciseEntries: { key: string, value: string, exercise?: Exercise }[] = [];
  detailEntries: { key: string, value: string }[] = [];

  constructor(
    private workoutService: WorkoutService, 
    private clientService: ClientService, 
    private authService: AuthService,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.workout;
    this.loadExercises();

    if (this.workout) {
      this.formData = {
        name: this.workout.name,
        trainingDuration: this.workoutService.formatDuration(this.workout.trainingDuration),
        trainingCompletedDate: this.workout.trainingCompletedDate,
        completed: this.workout.completed,
        description: this.workout.workoutDetails.description,
        intensity: this.workout.workoutDetails.intensity,
        exerciseListId: { ...this.workout.workoutDetails.exerciseListId },
        additionalDetails: { ...this.workout.workoutDetails.additionalDetails }
      };

      // Convertir los mapas a arrays para el formulario
      this.exerciseEntries = Object.entries(this.formData.exerciseListId).map(([key, value]) => ({ 
        key, 
        value, 
        exercise: undefined // Lo inicializamos vacío, se rellenará cuando se carguen los ejercicios
      }));
      this.detailEntries = Object.entries(this.formData.additionalDetails).map(([key, value]) => ({ key, value }));

      // Inicializar los arrays de filteredExercisesMap para cada entrada
      for (let i = 0; i < this.exerciseEntries.length; i++) {
        this.filteredExercisesMap[i] = [];
      }

      // Asegurar que hay al menos una entrada vacía
      if (this.exerciseEntries.length === 0) this.addExerciseEntry();
      if (this.detailEntries.length === 0) this.addDetailEntry();
    } else {
      // Inicializar con entradas vacías para un nuevo workout
      this.addExerciseEntry();
      this.addDetailEntry();
    }
  }
  
  // Cargar los ejercicios disponibles
  loadExercises(): void {
    this.exerciseService.getAllExercises().subscribe({
      next: (exercises) => {
        this.exercises = exercises;
      },
      error: (error) => {
        console.error('Error loading exercises', error);
      }
    });
  }
  
  // Filtrar ejercicios para el autocompletado
  filterExercise(event: any, index: number): void {
    const query = event.query.toLowerCase();
    this.filteredExercisesMap[index] = this.exercises.filter(
      exercise => exercise.name.toLowerCase().includes(query)
    );
  }
  
  // Añadir el ejercicio seleccionado a una entrada existente
  onExerciseSelect(event: any, index: number): void {
    const exercise = event as Exercise;
    if (exercise && exercise.id) {
      // Actualizar la entrada existente
      this.exerciseEntries[index].key = exercise.id.toString();
      this.exerciseEntries[index].value = exercise.name;
      this.exerciseEntries[index].exercise = exercise;
    }
  }

  // Manejar ejercicios
  addExerciseEntry(): void {
    const newIndex = this.exerciseEntries.length;
    this.exerciseEntries.push({ key: '', value: '', exercise: undefined });
    this.filteredExercisesMap[newIndex] = [];
  }

  removeExerciseEntry(index: number): void {
    this.exerciseEntries.splice(index, 1);
    if (this.exerciseEntries.length === 0) this.addExerciseEntry();
  }
  
  // Obtener el número de ejercicios existentes (para modo edición)
  getExistingExercisesCount(): number {
    if (!this.isEditing) return 0;
    return this.exerciseEntries.filter(entry => entry.key && entry.value).length;
  }
  
  // Obtener solo los nuevos ejercicios para añadir en modo edición
  getNewExerciseEntries(): { key: string, value: string, exercise?: Exercise }[] {
    if (!this.isEditing) return [];
    return this.exerciseEntries.filter(entry => !entry.key || !entry.value);
  }
  
  // Eliminar un nuevo ejercicio (para modo edición)
  removeNewExerciseEntry(index: number): void {
    // Calculamos el índice real en el array completo
    const realIndex = this.getExistingExercisesCount() + index;
    this.removeExerciseEntry(realIndex);
  }

  // Manejar detalles adicionales
  addDetailEntry(): void {
    this.detailEntries.push({ key: '', value: '' });
  }

  removeDetailEntry(index: number): void {
    this.detailEntries.splice(index, 1);
    if (this.detailEntries.length === 0) this.addDetailEntry();
  }

  // Preparar datos para enviar
  prepareFormData(): WorkoutCreateRequest | WorkoutUpdateRequest {
    // Convertir arrays a mapas
    const exerciseListId: Record<string, string> = {};
    this.exerciseEntries.forEach(entry => {
      // Verificamos que la entrada tenga un key (id del ejercicio) y un value (nombre del ejercicio)
      // El key puede venir directamente de entry.key o de entry.exercise?.id
      const exerciseId = entry.key || (entry.exercise?.id?.toString() || '');
      const exerciseName = entry.value || (entry.exercise?.name || '');
      
      if (exerciseId.trim() && exerciseName.trim()) {
        exerciseListId[exerciseId] = exerciseName;
      }
    });

    console.log('Exercises to save:', exerciseListId); // Depuración

    const additionalDetails: Record<string, string> = {};
    this.detailEntries.forEach(entry => {
      if (entry.key.trim() && entry.value.trim()) {
        additionalDetails[entry.key] = entry.value;
      }
    });

    // Convertir duración a segundos
    const trainingDuration = this.workoutService.parseDuration(this.formData.trainingDuration);

    if (this.isEditing) {
      // Preparar datos para actualización
      const updateData: WorkoutUpdateRequest = {
        name: this.formData.name,
        trainingDuration: trainingDuration,
        completed: this.formData.completed,
        workoutDetails: {
          description: this.formData.description,
          intensity: this.formData.intensity,
          exerciseListId: exerciseListId,
          additionalDetails: additionalDetails
        }
      };
      return updateData;
    } else {
      // Preparar datos para creación
      const createData: WorkoutCreateRequest = {
        name: this.formData.name,
        trainingDuration: trainingDuration,
        trainingCompletedDate: this.formData.trainingCompletedDate,
        completed: this.formData.completed,
        workoutDetails: {
          description: this.formData.description,
          intensity: this.formData.intensity,
          exerciseListId: exerciseListId,
          additionalDetails: additionalDetails
        }
      };
      return createData;
    }
  }

  // Enviar formulario
  handleSubmit(): void {
    // Validar formulario
    if (!this.formData.name.trim()) {
      this.errorMessage = 'Please enter a workout name';
      return;
    }

    if (!this.formData.trainingDuration) {
      this.errorMessage = 'Please enter a valid training duration';
      return;
    }

    if (!this.formData.description.trim()) {
      this.errorMessage = 'Please enter a workout description';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = this.prepareFormData();

    if (this.isEditing && this.workout) {
      // Actualizar workout existente
      this.workoutService.updateWorkout(this.workout.id, formData as WorkoutUpdateRequest).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.close.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error updating workout';
          console.error('Error updating workout', error);
        }
      });
    } else {
      // Crear nuevo workout
      this.workoutService.createWorkout(formData as WorkoutCreateRequest).subscribe({
        next: (workout) => {
          this.authService.getAuthClient().subscribe({
            next: (client) => {
              if (client) {
                client.workouts.push(workout.id.toString());
                this.clientService.updateClient(client.id, client).subscribe({
                  next: () => {
                    console.log('Client updated successfully');
                    this.refreshWorkouts.emit(workout.id);
                    this.isSubmitting = false;
                    this.close.emit();
                  },
                  error: (error) => {
                    console.error('Error updating client:', error);
                  }
                });
              }
            },
            error: (error) => {
              console.error('Error fetching client:', error);
            }
          });

        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error creating workout';
          console.error('Error creating workout', error);
        }
      });
    }
  }
}
