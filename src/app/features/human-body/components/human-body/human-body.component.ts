import {Component, OnDestroy, OnInit} from '@angular/core';
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
}




