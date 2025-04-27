import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, catchError, of, shareReplay, throwError, tap} from 'rxjs';
import { Exercise } from '../../../core/models/exercise/exercise';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private cache = new Map<string, Observable<Exercise[]>>();
  private baseUrl = 'http://localhost:8081/Exercises';

  constructor(private http: HttpClient) {}

  // Obtener ejercicios por área
  getExercises(area: string): Observable<Exercise[]> {
    if (!this.cache.has(area)) {
      const req$ = this.http
        .get<{ content: Exercise[] }>(`${this.baseUrl}?bodyPart=${area.toUpperCase()}`)
        .pipe(
          map(response => response.content),
          catchError(() => of([])),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      this.cache.set(area, req$);
    }
    return this.cache.get(area)!;
  }

  // Crear un nuevo ejercicio
  createExercise(ex: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(this.baseUrl, ex).pipe(
      tap(() => this.invalidateCache()),
      catchError(err => {
        console.error('Create failed', err);
        return throwError(() => err);
      })
    );
  }

  updateExercise(id: string, ex: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.baseUrl}/${id}`, ex).pipe(
      tap(() => this.invalidateCache()),
      catchError(err => {
        console.error('Update failed', err);
        return throwError(() => err);
      })
    );
  }

  deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.invalidateCache()),
      catchError(err => {
        console.error('Delete failed', err);
        return throwError(() => err);
      })
    );
  }

  private invalidateCache(): void {
    this.cache.clear();                                                    
  }
}


