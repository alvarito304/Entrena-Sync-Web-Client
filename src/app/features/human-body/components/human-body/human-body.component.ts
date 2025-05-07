/*import {Component, OnDestroy, OnInit} from '@angular/core';
import { MenBodySvgComponent } from '../men-body-svg/men-body-svg.component';
import { MenBackBodySvgComponent } from '../men-back-body-svg/men-back-body-svg.component';
import {ExerciseListComponent} from '../exercise-list/exercise-list.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {ExerciseService, PaginatedExercises} from '../../services/exercise.service';
import {
  BehaviorSubject,
  catchError, combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of, startWith,
  Subject,
  switchMap, take
} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {PaginationComponent} from '../../../../core/components/pagination/pagination.component';
import {SearchInputComponent} from '../../../../core/components/search-input/search-input.component';

@Component({
  selector: 'app-human-body',
  standalone: true,
  imports: [MenBodySvgComponent, MenBackBodySvgComponent, ExerciseListComponent, NgIf, AsyncPipe, FormsModule, PaginationComponent, SearchInputComponent],
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent implements OnInit, OnDestroy {
  protected area$    = new BehaviorSubject<string>('');
  private name$    = new Subject<string>();
  protected page$    = new BehaviorSubject<number>(0);

  exercises$!: Observable<PaginatedExercises>;
  searchName = '';
  pageSize    = 12;


  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    const debouncedName$ = this.name$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    );

    this.exercises$ = combineLatest([
      this.area$,
      debouncedName$,
      this.page$
    ]).pipe(
      switchMap(([area, name, page]) => {
        console.log('Fetching exercises for page:', page);
       return this.exerciseService
          .getExercises(area, name, page, this.pageSize)
          .pipe(catchError(() => of({ exercises: [], links: {}, totalPages: 0, totalElements: 0 })));
      })
    );
  }

  handlePieceClick(event: any): void {
    const pos = event.target.dataset.position || event.target.parentElement?.dataset.position;
    if (!pos) return;
    this.area$.next(pos);
    this.page$.next(0);
    this.name$.next(this.searchName);
  }

  onSearchName(value: string): void {
    this.searchName = value;
    this.page$.next(0);            // reset al buscar texto
    this.name$.next(this.searchName);
  }

  ngOnDestroy(): void {
    this.area$.complete();
    this.name$.complete();
    this.page$.complete();
  }
}*/


// human-body.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenBodySvgComponent } from '../men-body-svg/men-body-svg.component';
import { MenBackBodySvgComponent } from '../men-back-body-svg/men-back-body-svg.component';
import { ExerciseListComponent } from '../exercise-list/exercise-list.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ExerciseService, PaginatedExercises } from '../../services/exercise.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../core/components/pagination/pagination.component';
import { SearchInputComponent } from '../../../../core/components/search-input/search-input.component';
import {FilterField} from '../../../../core/models/filterFields/filterFields';

interface FilterQuery {
  [key: string]: string | number;
}

@Component({
  selector: 'app-human-body',
  standalone: true,
  imports: [
    MenBodySvgComponent,
    MenBackBodySvgComponent,
    ExerciseListComponent,
    NgIf,
    AsyncPipe,
    FormsModule,
    PaginationComponent,
    SearchInputComponent
  ],
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent implements OnInit, OnDestroy {
  protected area$ = new BehaviorSubject<string | null>(null);
  protected filter$ = new BehaviorSubject<FilterQuery>({});
  protected page$ = new BehaviorSubject<number>(0);

  exercises$!: Observable<PaginatedExercises>;
  pageSize = 12;

  // Restauramos los filterFields originales
  filterFields: FilterField[] = [
    { key: 'name', type: 'text', placeholder: 'Nombre' },
    { key: 'description', type: 'text', placeholder: 'Descripción' },
    { key: 'equipment', type: 'text', placeholder: 'Equipo' },
    { key: 'minCalories', type: 'number', placeholder: 'Calorías mínimas' },
    { key: 'maxCalories', type: 'number', placeholder: 'Calorías máximas' },
    {
      key: 'difficulty',
      type: 'select',
      placeholder: 'Dificultad',
      options: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
    }
  ];

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    const debouncedFilter$ = this.filter$.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

    this.exercises$ = combineLatest([
      this.area$,
      debouncedFilter$,
      this.page$
    ]).pipe(
      switchMap(([area, filters, page]) => {
        const params: any = { page, size: this.pageSize };

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params[key] = value;
          }
        });
        console.log('Fetching with params:', params);
        return this.exerciseService.getExercisesWithFilters(params)
          .pipe(
            catchError(err => {
              console.error('API error', err);
              return of({ exercises: [], links: {}, totalPages: 0, totalElements: 0 });
            })
          );
      })
    );
  }

  handlePieceClick(event: any): void {
    const pos = event.target.dataset.position || event.target.parentElement?.dataset.position;
    console.log('Area clicked raw:', pos);

    const newFilters = { ...this.filter$.getValue(), bodyPart: pos?.toUpperCase() || null };
    this.filter$.next(newFilters);
    this.page$.next(0);
  }


  onFilter(query: { [key: string]: any }): void {
    const newFilters = { ...this.filter$.getValue(), ...query };
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] === '' || newFilters[key] === null) {
        delete newFilters[key];
      }
    });

    this.filter$.next(newFilters);
    this.page$.next(0);
  }


  ngOnDestroy(): void {
    this.area$.complete();
    this.filter$.complete();
    this.page$.complete();
  }
}
