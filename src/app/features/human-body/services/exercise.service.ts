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

  getExercises(
    area: string,
    name?: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedExercises> {
    let params = new HttpParams()
      .set('bodyPart', area.toUpperCase())
      .set('page', page.toString())
      .set('size', size.toString());

    if (name?.trim()) {
      params = params.set('name', name.trim());
    }

    return this.http
      .get<{
        content: Exercise[];
        totalPages: number;
        totalElements: number
      }>(this.baseUrl, { params, observe: 'response' })
      .pipe(
        map(resp => {
          const body = resp.body?.content ?? [];
          const linkHeader = resp.headers.get('link') ?? '';
          const links = linkHeader ? this.parseLinkHeader(linkHeader) : {};
          const totalPages = resp.body?.totalPages ?? 0;
          const totalElements = resp.body?.totalElements ?? 0;
          return { exercises: body, links, totalPages, totalElements };
        }),
        catchError(() => of({ exercises: [], links: {}, totalPages: 0, totalElements: 0 })),
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


