import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FilterField} from '../../models/filterFields/filterFields';
import {InputText} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonDirective, ButtonIcon} from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import {Select} from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-search-input',
  imports: [
    FormsModule,
    InputText,
    DropdownModule,
    ButtonDirective,
    CommonModule,
    TabsModule,
    Select,
    ButtonIcon,
    InputNumberModule
  ],
  templateUrl: './search-input.component.html',
  standalone: true,
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent implements OnChanges {
  @Input() fields: FilterField[] = [];
  @Input() activeFilters: { [key: string]: any } = {};
  @Output() search = new EventEmitter<{ [key: string]: any }>();
  @Output() resetAll = new EventEmitter<void>();

  values: { [key: string]: any } = {};

  value: number = 0;

  ngOnChanges() {
    this.values = { ...this.activeFilters };
  }

  onSearch() {
    const emittedValues = { ...this.values };
    this.search.emit(emittedValues);
  }

  reset() {
    this.values = {};

    this.fields.forEach(field => {
      this.values[field.key] = '';
    });

    this.search.emit(this.values);
    this.resetAll.emit();
  }

  onTabChange() {
    if (this.value === 0) {
      this.reset();
    }
  }

}
