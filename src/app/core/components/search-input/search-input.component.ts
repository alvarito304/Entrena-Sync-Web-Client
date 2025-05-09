import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FilterField} from '../../models/filterFields/filterFields';
import {InputText} from 'primeng/inputtext';
import {Sidebar} from 'primeng/sidebar';
import {DropdownModule} from 'primeng/dropdown';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {SpeedDial} from 'primeng/speeddial';
import {Panel} from 'primeng/panel';
import {ButtonDirective, ButtonIcon} from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import {StyleClass} from 'primeng/styleclass';
import {Select} from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-search-input',
  imports: [
    FormsModule,
    InputText,
    Sidebar,
    DropdownModule,
    ConfirmDialog,
    SpeedDial,
    Panel,
    ButtonDirective,
    CommonModule,
    TabsModule,
    StyleClass,
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
