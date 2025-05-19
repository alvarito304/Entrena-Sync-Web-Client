import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {WorkoutFormComponent} from '../../components/workout-form/workout-form.component';
import {PageResponse, WorkoutResponse} from '../../../../core/models/workouts/workoutsInterface';
import {WorkoutService} from '../../service/workouts.service';

@Component({
  selector: 'app-workout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoutFormComponent, HttpClientModule],
  templateUrl: './workout-page.component.html',
})
export class WorkoutPageComponent implements OnInit {
  // Estado del componente
  workouts: WorkoutResponse[] = [];
  upcomingWorkouts: WorkoutResponse[] = [];
  completedWorkouts: WorkoutResponse[] = [];
  activeTab = 'upcoming';
  isCreating = false;
  selectedWorkout: WorkoutResponse | null = null;
  isLoading = true;

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'trainingCompletedDate';
  direction = 'DESC';

  // Filtros
  nameFilter: string | null = null;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.isLoading = true;
    this.workoutService.getWorkouts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.direction,
      this.nameFilter
    ).subscribe({
      next: (response: PageResponse<WorkoutResponse>) => {
        this.workouts = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.filterWorkouts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading workouts', error);
        this.isLoading = false;
      }
    });
  }

  // Filtrar workouts por estado completado
  filterWorkouts(): void {
    this.upcomingWorkouts = this.workouts.filter(w => !w.completed);
    this.completedWorkouts = this.workouts.filter(w => w.completed);
  }

  // Formatear fecha para mostrar
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // Formatear duración
  formatDuration(seconds: number): string {
    return this.workoutService.formatDuration(seconds);
  }

  // Marcar como completado/pendiente
  // Marcar como completado/pendiente
  toggleWorkoutStatus(workout: WorkoutResponse): void {
    // Crear una copia del objeto para no modificar el original directamente
    const updateData: any = {
      name: workout.name,
      trainingDuration: workout.trainingDuration,
      completed: !workout.completed,
      workoutDetails: {
        description: workout.workoutDetails.description,
        intensity: workout.workoutDetails.intensity,
        exerciseListId: workout.workoutDetails.exerciseListId,
        additionalDetails: workout.workoutDetails.additionalDetails
      }
    };

    console.log('Sending update data:', updateData);

    this.workoutService.updateWorkout(workout.id, updateData).subscribe({
      next: (updatedWorkout) => {
        console.log('Workout updated successfully:', updatedWorkout);
        // Actualizar localmente para evitar recargar toda la página
        workout.completed = !workout.completed;
        this.filterWorkouts(); // Re-filtrar para mover entre pestañas
      },
      error: (error) => {
        console.error('Error updating workout status', error);
        // Mostrar mensaje de error al usuario
        alert('Error updating workout status: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  // Editar workout
  editWorkout(workout: WorkoutResponse): void {
    this.selectedWorkout = workout;
  }

  // Eliminar workout
  deleteWorkout(workout: WorkoutResponse): void {
    if (confirm('Are you sure you want to delete this workout?')) {
      this.workoutService.deleteWorkout(workout.id).subscribe({
        next: () => {
          this.loadWorkouts();
        },
        error: (error) => {
          console.error('Error deleting workout', error);
        }
      });
    }
  }

  // Manejar paginación
  changePage(page: number): void {
    this.currentPage = page;
    this.loadWorkouts();
  }

  // Aplicar filtros
  applyFilters(): void {
    this.currentPage = 0; // Resetear a primera página
    this.loadWorkouts();
  }

  // Limpiar filtros
  clearFilters(): void {
    this.nameFilter = null;
    this.applyFilters();
  }

  // Cerrar formulario
  closeForm(): void {
    this.isCreating = false;
    this.selectedWorkout = null;
    this.loadWorkouts(); // Recargar datos
  }

  // Convertir mapa de ejercicios a array para iterar en la plantilla
  getExerciseEntries(exerciseMap: Record<string, string>): {key: string, value: string}[] {
    return Object.entries(exerciseMap).map(([key, value]) => ({ key, value }));
  }

  // Generar array para paginación
  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si hay menos que el máximo visible
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar un subconjunto de páginas
      let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);

      // Ajustar si estamos cerca del final
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  protected readonly Object = Object;
}
