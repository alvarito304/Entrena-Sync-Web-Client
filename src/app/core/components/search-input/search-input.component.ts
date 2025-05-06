import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [
    FormsModule
  ],
  templateUrl: './search-input.component.html',
  standalone: true,
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Buscar...';
  @Output() search = new EventEmitter<string>();

  value: string = '';

  onChange() {
    this.search.emit(this.value);
  }
}
