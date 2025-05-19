import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces (puedes importarlas de un archivo compartido)
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
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-form.component.html',
})
export class WorkoutFormComponent implements OnInit {
  @Input() workout?: Workout;
  @Output() save = new EventEmitter<Workout>();
  @Output() close = new EventEmitter<void>();

  isEditing = false;

  formData: {
    title: string;
    description: string;
    date: string;
    exercises: WorkoutExercise[];
  } = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    exercises: [
      { id: Date.now().toString(), name: '', sets: 3, reps: 10, weight: undefined, duration: undefined, notes: '' },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    this.isEditing = !!this.workout;

    if (this.workout) {
      this.formData = {
        title: this.workout.title,
        description: this.workout.description || '',
        date: this.workout.date,
        exercises: JSON.parse(JSON.stringify(this.workout.exercises)), // Deep copy
      };
    }
  }

  addExercise(): void {
    this.formData.exercises.push({
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined,
      duration: undefined,
      notes: '',
    });
  }

  removeExercise(id: string): void {
    if (this.formData.exercises.length > 1) {
      this.formData.exercises = this.formData.exercises.filter((ex) => ex.id !== id);
    }
  }

  handleSubmit(): void {
    // Validar formulario
    if (!this.formData.title.trim()) {
      alert('Please enter a workout title');
      return;
    }

    if (this.formData.exercises.some((ex) => !ex.name.trim())) {
      alert('Please enter a name for all exercises');
      return;
    }

    // Crear o actualizar workout
    const workoutData: Workout = {
      id: this.workout?.id || Date.now().toString(),
      ...this.formData,
      completed: this.workout?.completed || false,
    };

    this.save.emit(workoutData);
    this.close.emit();
  }
}
