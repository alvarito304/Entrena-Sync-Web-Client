import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-form.component.html',
})
export class WorkoutFormComponent implements OnInit {
  @Input() workout?: WorkoutResponse;
  @Output() close = new EventEmitter<void>();
  @Output() refreshWorkouts = new EventEmitter<number>();

  isEditing = false;
  isSubmitting = false;
  errorMessage = '';

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
  exerciseEntries: { key: string, value: string }[] = [];
  detailEntries: { key: string, value: string }[] = [];

  constructor(private workoutService: WorkoutService, private clientService: ClientService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isEditing = !!this.workout;

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
      this.exerciseEntries = Object.entries(this.formData.exerciseListId).map(([key, value]) => ({ key, value }));
      this.detailEntries = Object.entries(this.formData.additionalDetails).map(([key, value]) => ({ key, value }));

      // Asegurar que hay al menos una entrada vacía
      if (this.exerciseEntries.length === 0) this.addExerciseEntry();
      if (this.detailEntries.length === 0) this.addDetailEntry();
    } else {
      // Inicializar con entradas vacías para un nuevo workout
      this.addExerciseEntry();
      this.addDetailEntry();
    }
  }

  // Manejar ejercicios
  addExerciseEntry(): void {
    this.exerciseEntries.push({ key: '', value: '' });
  }

  removeExerciseEntry(index: number): void {
    this.exerciseEntries.splice(index, 1);
    if (this.exerciseEntries.length === 0) this.addExerciseEntry();
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
      if (entry.key.trim() && entry.value.trim()) {
        exerciseListId[entry.key] = entry.value;
      }
    });

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
