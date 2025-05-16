// src/app/services/exercise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {Observable, of, tap, throwError} from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import {Exercise} from '../../../core/models/exercise/exercise';

export interface PaginatedExercises {
  exercises: Exercise[];
  links: Record<string, { url: string; page: string; rel: string }>;
  totalPages: number;
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private cache = new Map<string, Observable<PaginatedExercises>>();
  private baseUrl = 'http://localhost:8081/Exercises';

  constructor(private http: HttpClient) {}

  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.baseUrl}/all`).pipe(
      catchError(err => {
        console.error('Error fetching all exercises', err);
        return throwError(() => err);
      })
    );
  }


  getExercisesWithFilters(params: {[key:string]: string|number}): Observable<PaginatedExercises> {
    let httpParams = new HttpParams();

    // Convierte cada propiedad de `params` en un query-param
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && String(value).trim() !== '') {
        httpParams = httpParams.set(key, String(value).trim());
      }
    });

    return this.http
      .get<{ content: Exercise[]; totalPages: number; totalElements: number }>(
        this.baseUrl,
        { params: httpParams, observe: 'response' }
      )
      .pipe(
        map(resp => {
          const body = resp.body?.content ?? [];
          const linkHeader = resp.headers.get('link') ?? '';
          const links = linkHeader ? this.parseLinkHeader(linkHeader) : {};
          return {
            exercises: body,
            links,
            totalPages: resp.body?.totalPages ?? 0,
            totalElements: resp.body?.totalElements ?? 0
          };
        }),
        catchError(() => of({ exercises: [], links: {}, totalPages: 0, totalElements: 0 }))
      );
  }

// Crear un nuevo ejercicio
  createExercise(form: FormData): Observable<Exercise> {
    return this.http.post<Exercise>(this.baseUrl, form).pipe(
      tap(() => this.invalidateCache()),
      catchError(err => {
        console.error('Create failed', err);
        return throwError(() => err);
      })
    );
  }

  updateExercise(id: string, form: FormData): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.baseUrl}/${id}`, form).pipe(
      tap(() => this.invalidateCache()),
      catchError(err => {
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

  private parseLinkHeader(header: string): Record<string, { url: string; page: string; rel: string }> {
    const links: Record<string, { url: string; page: string; rel: string }> = {};
    const parts = header.split(',');

    parts.forEach(part => {
      const section = part.split(';');
      if (section.length !== 2) {
        return;
      }
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const rel = section[1].replace(/rel="(.*)"/, '$1').trim();
      const urlObj = new URL(url);
      const page = urlObj.searchParams.get('page') || '';
      links[rel] = { url, page, rel };
    });

    return links;
  }

}


