import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {WorkoutFormComponent} from '../../components/workout-form/workout-form.component';
import {PageResponse, WorkoutResponse} from '../../../../core/models/workouts/workoutsInterface';
import {WorkoutService} from '../../service/workouts.service';
import {AuthService} from '../../../keycloak/services/auth.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-workout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoutFormComponent, HttpClientModule, PaginatorModule],
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
  // Paginación específica para cada pestaña
  upcomingTotalElements = 0;
  completedTotalElements = 0;
  sortBy = 'trainingCompletedDate';
  direction = 'DESC';

  // Filtros
  nameFilter: string | null = null;
  idsFilter: number[] | undefined = undefined;

  constructor(private workoutService: WorkoutService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAuthClient().subscribe({
      next: (client) => {
        console.log('Client data:', client);
        this.idsFilter = client.workouts ? client.workouts.map(Number) : undefined;
        console.log('IDs filter:', this.idsFilter);

        if (this.idsFilter && this.idsFilter.length > 0) {
          // Inicializa según la pestaña activa por defecto
          this.loadTabData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching client data:', error);
        this.isLoading = false;
      }
    });
  }

  // Método principal para cargar datos según la pestaña activa
  loadTabData(): void {
    if (this.activeTab === 'upcoming') {
      this.loadUpcomingWorkouts();
    } else if (this.activeTab === 'completed') {
      this.loadCompletedWorkouts();
    } else {
      this.loadAllWorkouts();
    }
  }

  loadAllWorkouts(): void {
    this.isLoading = true;
    this.workoutService.getWorkouts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.direction,
      this.idsFilter,
      this.nameFilter
    ).subscribe({
      next: (response) => {
        this.workouts = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.filterWorkouts();
        this.isLoading = false;
        
        // Calcular totales por categoría una vez
        this.calculateTotalsByCategory();
      },
      error: (error) => {
        console.error('Error loading workouts', error);
        this.isLoading = false;
      }
    });
  }

  loadUpcomingWorkouts(): void {
    this.isLoading = true;
    this.workoutService.getWorkouts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.direction,
      this.idsFilter,
      this.nameFilter,
      false
    ).subscribe({
      next: (response) => {
        this.upcomingWorkouts = response.content;
        this.totalPages = response.totalPages;
        this.upcomingTotalElements = response.totalElements;
        this.totalElements = this.upcomingTotalElements; // Actualizar para la paginación actual
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading upcoming workouts', error);
        this.isLoading = false;
      }
    });
  }

  loadCompletedWorkouts(): void {
    this.isLoading = true;
    this.workoutService.getWorkouts(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.direction,
      this.idsFilter,
      this.nameFilter,
      true
    ).subscribe({
      next: (response) => {
        this.completedWorkouts = response.content;
        this.totalPages = response.totalPages;
        this.completedTotalElements = response.totalElements;
        this.totalElements = this.completedTotalElements; // Actualizar para la paginación actual
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading completed workouts', error);
        this.isLoading = false;
      }
    });
  }

  // Calcular totales por categoría para mostrar en la información
  calculateTotalsByCategory(): void {
    // Si ya tenemos todos los workouts cargados, podemos calcular los totales por categoría
    this.upcomingTotalElements = this.workouts.filter(w => !w.completed).length;
    this.completedTotalElements = this.workouts.filter(w => w.completed).length;
  }

  // Filtrar workouts por estado completado (solo usado cuando se cargan todos los workouts)
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
        // Recargamos los datos de la pestaña actual para mantener la consistencia
        this.loadTabData();
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
          this.loadTabData(); // Cargar datos según la pestaña activa
        },
        error: (error) => {
          console.error('Error deleting workout', error);
          alert('Error deleting workout: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }

  // Manejar paginación
  changePage(page: number): void {
    this.currentPage = page;
    this.loadTabData();
  }

  // Aplicar filtros
  applyFilters(): void {
    this.currentPage = 0; // Resetear a primera página
    this.loadTabData();
  }

  // Limpiar filtros
  clearFilters(): void {
    this.nameFilter = null;
    this.currentPage = 0; // Resetear a primera página
    this.loadTabData();
  }

  // Cerrar formulario
  closeForm(): void {
    this.isCreating = false;
    this.selectedWorkout = null;

    // RECARGA el cliente y actualiza idsFilter
    this.authService.getAuthClient().subscribe({
      next: (client) => {
        console.log('Client data:', client);
        this.idsFilter = client.workouts ? client.workouts.map(Number) : undefined;
        console.log('IDs filter:', this.idsFilter);

        if (this.idsFilter && this.idsFilter.length > 0) {
          this.currentPage = 0; // Reiniciar la página al cerrar el formulario
          this.loadTabData(); // Cargar datos según la pestaña activa
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching client data:', error);
        this.isLoading = false;
      }
    });
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

  // Manejador de cambio de página para el paginador de PrimeNG
  onPageChange(event: any): void {
    console.log('Cambio de página:', event);
    this.currentPage = event.page;
    this.loadTabData();
  }

  // Cambia la pestaña activa y recarga los datos
  setActiveTab(tab: string): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.currentPage = 0; // Reiniciar la página actual
      this.loadTabData();
    }
  }

  handleRefresh(): void {
    this.currentPage = 0; // Reiniciar la página actual
    this.loadTabData();
  }


  protected readonly Object = Object;
  protected readonly Math = Math;
}
