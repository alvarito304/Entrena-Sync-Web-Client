// Interfaces que reflejan los DTOs del backend

// Para WorkoutDetails
export interface WorkoutDetailsResponse {
  id: number;
  description: string;
  intensity: number;
  exerciseListId: Record<string, string>;
  additionalDetails: Record<string, string>;
}

export interface WorkoutDetailsCreateRequest {
  description: string;
  intensity: number;
  exerciseListId: Record<string, string>;
  additionalDetails: Record<string, string>;
}

export interface WorkoutDetailsUpdateRequest {
  description?: string;
  intensity?: number;
  exerciseListId?: Record<string, string>;
  additionalDetails?: Record<string, string>;
}

// Para Workout
export interface WorkoutCreateRequest {
  name: string;
  trainingDuration: number; // en segundos
  trainingCompletedDate: string; // formato ISO para LocalDate
  completed: boolean;
  workoutDetails: WorkoutDetailsCreateRequest;
}

export interface WorkoutUpdateRequest {
  name?: string;
  trainingDuration?: number;
  completed?: boolean;
  workoutDetails?: WorkoutDetailsUpdateRequest;
}

export interface WorkoutResponse {
  id: number;
  name: string;
  trainingDuration: number;
  trainingCompletedDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  workoutDetails: WorkoutDetailsResponse;
}

// Interfaz para paginación
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
