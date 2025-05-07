import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {FilterField} from '../../models/filterFields/filterFields';

@Component({
  selector: 'app-search-input',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './search-input.component.html',
  standalone: true,
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent implements OnChanges {
  @Input() fields: FilterField[] = [];
  @Input() activeFilters: { [key: string]: any } = {};
  @Output() search = new EventEmitter<{ [key: string]: any }>();

  values: { [key: string]: any } = {};

  ngOnChanges() {
    this.values = { ...this.activeFilters };
  }

  onSearch() {
    const emittedValues = { ...this.values };
    this.search.emit(emittedValues);
  }

  reset() {
    this.values = {};

    // Asignamos valores vacíos o `null` para todos los campos para forzar el reset.
    this.fields.forEach(field => {
      this.values[field.key] = '';
    });

    this.search.emit(this.values);
  }

}
