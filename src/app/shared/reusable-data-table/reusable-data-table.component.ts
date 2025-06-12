import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Tooltip, TooltipModule} from 'primeng/tooltip';
import {Button, ButtonModule} from 'primeng/button';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {Tag, TagModule} from 'primeng/tag';
import {MultiSelect, MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {Table, TableModule} from 'primeng/table';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';

export interface Column {
  field: string
  header: string
  style?: string
  type?: "text" | "image" | "currency" | "rating" | "tag" | "custom" | "date" | "number" | "dropdown" | "boolean"
  format?: string
  options?: any[]
  filterField?: string
  optionLabel?: string
  optionValue?: string
}


@Component({
  selector: "app-generic-table",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    TagModule,
    TooltipModule,
  ],
  styleUrls: ['reusable-data-table.component.css'],
  template: `
    <div class="card">
      <p-table
        #dt
        [value]="data"
        [columns]="cols"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="getGlobalFilterFields()"
        [loading]="loading"
        styleClass="p-datatable-gridlines p-datatable-striped"
        [tableStyle]="{ 'min-width': '50rem' }"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        [rowHover]="true"
        dataKey="id"
        [resizableColumns]="true"
        [reorderableColumns]="true"
        [responsive]="true"
      >
        <ng-template pTemplate="caption">
          <div class="flex justify-content-between align-items-center">
            <h5 class="m-0">{{ title }}</h5>
            <div class="flex align-items-center">
              <!-- En el template -->
              <span class="mr-2">
                <input pInputText type="text" placeholder="Buscar..." (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
              </span>
              <button
                pButton
                label="Limpiar"
                class="p-button-outlined"
                icon="pi pi-filter-slash"
                (click)="clear(dt)"
              ></button>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="header" let-columns>
          <tr>
            <th *ngFor="let col of columns" [pSortableColumn]="col.field" [style]="col.style">
              <div class="flex justify-content-between align-items-center">
                {{ col.header }}
                <p-sortIcon [field]="col.field"></p-sortIcon>

                <!-- Filtros específicos por tipo de columna -->
                <p-columnFilter
                  *ngIf="!col.type || col.type === 'text'"
                  type="text"
                  [field]="col.filterField || col.field"
                  display="menu"
                  class="bg-white text-black placeholder-black"
                ></p-columnFilter>

                <p-columnFilter
                  *ngIf="col.type === 'date'"
                  type="date"
                  [field]="col.filterField || col.field"
                  display="menu"
                  class="bg-white text-black placeholder-black"
                ></p-columnFilter>

                <p-columnFilter
                  *ngIf="col.type === 'number' || col.type === 'currency'"
                  type="numeric"
                  [field]="col.filterField || col.field"
                  display="menu"
                  class="bg-white text-black placeholder-black"
                ></p-columnFilter>

                <p-columnFilter
                  *ngIf="col.type === 'dropdown' && col.options"
                  [field]="col.filterField || col.field"
                  matchMode="equals"
                  display="menu"
                  class="bg-white text-black placeholder-black"
                >
                  <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                    <p-dropdown
                      [ngModel]="value"
                      [options]="col.options"
                      (onChange)="filter($event.value)"
                      placeholder="Seleccionar"
                      [showClear]="true"
                      [optionLabel]="col.optionLabel || 'label'"
                      [optionValue]="col.optionValue || 'value'"
                      class="bg-white text-black placeholder-black"
                    >
                    </p-dropdown>
                  </ng-template>
                </p-columnFilter>
              </div>
            </th>
            <th *ngIf="showActions" style="width: 8rem">Acciones</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr>
            <td *ngFor="let col of columns">
              <!-- Renderizado según el tipo de dato -->
              <ng-container [ngSwitch]="col.type">
                <!-- Fecha -->
                <ng-container *ngSwitchCase="'date'">
                  {{ getNestedValue(rowData, col.field) | date:(col.format || 'dd/MM/yyyy') }}
                </ng-container>

                <!-- Número -->
                <ng-container *ngSwitchCase="'number'">
                  {{ getNestedValue(rowData, col.field) | number:(col.format || '1.2-2') }}
                </ng-container>

                <!-- Moneda -->
                <ng-container *ngSwitchCase="'currency'">
                  {{ getNestedValue(rowData, col.field) | currency:(col.format || 'EUR'):'symbol':'1.2-2' }}
                </ng-container>

                <!-- Rating -->
                <ng-container *ngSwitchCase="'rating'">
                  <div class="flex align-items-center">
                    <span class="mr-1">{{ getNestedValue(rowData, col.field) }}</span>
                    <i class="pi pi-star-fill text-yellow-500"></i>
                  </div>
                </ng-container>

                <!-- Tag -->
                <ng-container *ngSwitchCase="'tag'">
                  <p-tag
                    [value]="getNestedValue(rowData, col.field)"
                    [severity]="getSeverityForTag(getNestedValue(rowData, col.field))"
                  ></p-tag>
                </ng-container>

                <!-- Imagen -->
                <ng-container *ngSwitchCase="'image'">
                  <img
                    [src]="getNestedValue(rowData, col.field)"
                    [alt]="col.header"
                    class="w-3rem h-3rem border-round"
                  />
                </ng-container>

                <!-- Booleano -->
                <ng-container *ngSwitchCase="'boolean'">
                  <p-tag
                    [value]="getNestedValue(rowData, col.field) ? 'Sí' : 'No'"
                    [severity]="getNestedValue(rowData, col.field) ? 'success' : 'danger'"
                  ></p-tag>
                </ng-container>

                <!-- Dropdown -->
                <ng-container *ngSwitchCase="'dropdown'">
                  {{ getOptionLabel(col, getNestedValue(rowData, col.field)) }}
                </ng-container>

                <!-- Custom -->
                <ng-container *ngSwitchCase="'custom'">
                  <ng-container *ngTemplateOutlet="customTemplate; context: { $implicit: rowData, field: col.field }"></ng-container>
                </ng-container>

                <!-- Texto por defecto -->
                <ng-container *ngSwitchDefault>
                  {{ getNestedValue(rowData, col.field) }}
                </ng-container>
              </ng-container>
            </td>

            <!-- Acciones -->
            <td *ngIf="showActions" class="text-center">
              <div class="flex justify-content-center gap-2">
                <button
                  pButton
                  pRipple
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-info"
                  pTooltip="Ver detalles"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="showActions ? cols.length + 1 : cols.length" class="text-center p-4">
              <div class="flex flex-column align-items-center">
                <i class="pi pi-info-circle text-4xl text-gray-400 mb-2"></i>
                <span>{{ emptyMessage }}</span>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class GenericTableComponent {
  @ViewChild("dt") table!: Table

  @Input() data: any[] = []
  @Input() cols: Column[] = []
  @Input() loading = false
  @Input() title = ""
  @Input() emptyMessage = "No se encontraron registros"
  @Input() showActions = false
  @Input() customTemplate: any // Template personalizado para celdas

  clear(table: Table) {
    table.clear()
  }

  getNestedValue(obj: any, path: string): any {
    if (!path) return ""
    return path.split(".").reduce((o, p) => (o && o[p] !== undefined ? o[p] : ""), obj)
  }

  getOptionLabel(col: Column, value: any): string {
    if (!col.options || !value) return value
    const option = col.options.find((opt) => (col.optionValue ? opt[col.optionValue] === value : opt.value === value))
    return option ? (col.optionLabel ? option[col.optionLabel] : option.label) : value
  }

  getSeverityForTag(value: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (value.toLowerCase()) {
      case 'activo':
      case 'completed':
        return 'success';
      case 'pendiente':
      case 'in progress':
        return 'info';
      case 'cancelado':
        return 'danger';
      case 'advertencia':
      case 'warning': // ⚠️ Aquí es donde ocurre el error
        return 'warn'; // ✅ Corrige esto
      default:
        return undefined;
    }
  }


  getGlobalFilterFields(): string[] {
    return this.cols.map((col) => col.filterField || col.field)
  }
}
