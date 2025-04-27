import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, shareReplay, catchError, of, startWith} from 'rxjs';
import { Exercise } from '../../../core/models/exercise/exercise';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private cache = new Map<string, Observable<Exercise[]>>();

  constructor(private http: HttpClient) {}

  getExercises(area: string): Observable<Exercise[]> {
    if (!this.cache.has(area)) {
      const req$ = this.http
        .get<{ content: Exercise[] }>(`http://localhost:8081/Exercises?bodyPart=${area.toUpperCase()}`)
        .pipe(
          map(response => response.content),
          catchError(() => of([])),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      this.cache.set(area, req$);
    }
    return this.cache.get(area)!;
  }
}
