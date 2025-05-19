import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WorkoutFormComponent} from '../../components/workout-form/workout-form.component';

// Interfaces
interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface Workout {
  id: string;
  title: string;
  description?: string;
  date: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

@Component({
  selector: 'app-workout-page',
  standalone: true,
  imports: [CommonModule, WorkoutFormComponent],
  templateUrl: './workout-page.component.html',
})
export class WorkoutPageComponent implements OnInit {
  // Estado del componente
  workouts: Workout[] = [];
  upcomingWorkouts: Workout[] = [];
  completedWorkouts: Workout[] = [];
  activeTab = 'upcoming';
  isCreating = false;
  selectedWorkout: Workout | null = null;

  // Datos de ejemplo
  initialWorkouts: Workout[] = [
    // ... (mismo contenido que antes)
  ];

  constructor() {}

  ngOnInit(): void {
    // Cargar datos desde localStorage o usar datos iniciales
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      this.workouts = JSON.parse(savedWorkouts);
    } else {
      this.workouts = this.initialWorkouts;
    }

    this.filterWorkouts();
  }

  // Filtrar workouts por completados y pendientes
  filterWorkouts(): void {
    this.upcomingWorkouts = this.workouts.filter(w => !w.completed);
    this.completedWorkouts = this.workouts.filter(w => w.completed);
  }

  // Formatear fecha para mostrar
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // Cambiar estado de completado
  toggleComplete(workout: Workout): void {
    workout.completed = !workout.completed;
    this.saveWorkouts();
    this.filterWorkouts();
  }

  // Editar workout
  editWorkout(workout: Workout): void {
    this.selectedWorkout = workout;
  }

  // Eliminar workout
  deleteWorkout(workout: Workout): void {
    if (confirm('Are you sure you want to delete this workout?')) {
      this.workouts = this.workouts.filter(w => w.id !== workout.id);
      this.saveWorkouts();
      this.filterWorkouts();
    }
  }

  // Guardar workouts en localStorage
  saveWorkouts(): void {
    localStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  // Manejar el guardado de un workout (nuevo o editado)
  handleSaveWorkout(workout: Workout): void {
    if (this.workouts.some(w => w.id === workout.id)) {
      // Actualizar workout existente
      this.workouts = this.workouts.map(w =>
        w.id === workout.id ? workout : w
      );
    } else {
      // Añadir nuevo workout
      this.workouts.push(workout);
    }

    this.saveWorkouts();
    this.filterWorkouts();
    this.selectedWorkout = null;
  }

  // Cerrar formulario
  closeForm(): void {
    this.isCreating = false;
    this.selectedWorkout = null;
  }
}
