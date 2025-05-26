import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  WorkoutResponse,
  WorkoutCreateRequest,
  WorkoutUpdateRequest,
  PageResponse
} from '../../../core/models/workouts/workoutsInterface';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = 'http://localhost:8083/Workouts'; // Ajusta según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener workouts con paginación y filtros
  getWorkouts(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    direction: string = 'ASC',
    ids?: number[],
    name?: string | null,
    completed?: boolean | null,
    trainingDuration?: number,
    trainingCompletedDate?: string
  ): Observable<PageResponse<WorkoutResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);


    if (ids && ids.length > 0) {
      params = params.set('ids', ids.join(','));
    }
    if (name) params = params.set('name', name);
    if (completed !== null && completed !== undefined) params = params.set('completed', completed.toString());
    if (trainingDuration) params = params.set('trainingDuration', trainingDuration.toString());
    if (trainingCompletedDate) params = params.set('trainingCompletedDate', trainingCompletedDate);

    return this.http.get<PageResponse<WorkoutResponse>>(this.apiUrl, { params });
  }

  // Obtener un workout por ID
  getWorkoutById(id: number): Observable<WorkoutResponse> {
    return this.http.get<WorkoutResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo workout
  createWorkout(workout: WorkoutCreateRequest): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(this.apiUrl, workout);
  }

  // Actualizar un workout existente
  updateWorkout(id: number, workout: WorkoutUpdateRequest): Observable<WorkoutResponse> {
    return this.http.put<WorkoutResponse>(`${this.apiUrl}/${id}`, workout);
  }

  // Eliminar un workout
  deleteWorkout(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Utilidad para formatear segundos a formato legible
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${remainingSeconds}s`;
  }

  // Utilidad para convertir formato legible a segundos
  parseDuration(duration: string): number {
    let totalSeconds = 0;

    const hoursMatch = duration.match(/(\d+)h/);
    if (hoursMatch) totalSeconds += parseInt(hoursMatch[1]) * 3600;

    const minutesMatch = duration.match(/(\d+)m/);
    if (minutesMatch) totalSeconds += parseInt(minutesMatch[1]) * 60;

    const secondsMatch = duration.match(/(\d+)s/);
    if (secondsMatch) totalSeconds += parseInt(secondsMatch[1]);

    return totalSeconds;
  }
}
