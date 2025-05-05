import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator, PaginatorState  } from 'primeng/paginator';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';
import {PrimaryButtonComponent} from '../primary-button/primary-button.component';
import {StyleClass} from 'primeng/styleclass';

@Component({
  selector: 'app-pagination',
  imports: [Paginator, PrimeTemplate, PrimaryButtonComponent, AsyncPipe, DecimalPipe, StyleClass, NgIf, NgForOf],
  templateUrl: './pagination.component.html',
  standalone: true,
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() page!: number;
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() links: Record<string, { page: string }> = {};
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(newPage: number) {
    this.pageChange.emit(newPage);
  }

  // Número total de páginas
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  // Array [0,1,2,...,totalPages-1]
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }


}
