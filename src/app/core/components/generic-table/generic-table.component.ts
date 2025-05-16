import { ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import {Button, ButtonModule} from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {Column} from '../../models/colum/column';
import {ExportColumn} from '../../models/colum/export-column';

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  standalone: true,
  imports: [
    TableModule,
    Dialog,
    Ripple,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUpload,
    SelectModule,
    Tag,
    RadioButton,
    Rating,
    InputTextModule,
    FormsModule,
    InputNumber,
    IconFieldModule,
    InputIconModule,
    Button
  ],
  providers: [MessageService, ConfirmationService]
})
export class GenericTableComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() cols: Column[] = [];
  @Input() title: string = 'Manage Items';
  @Input() entityName: string = 'items';
  @Input() idField: string = 'id';
  @Input() nameField: string = 'name';
  @Input() globalFilterFields: string[] = [];
  @Input() severityMap: { [key: string]: string } = {};
  @Input() isFormValid: boolean = false;

  @ContentChild('formTemplate') formTemplate!: TemplateRef<any>;

  @Output() onSave = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onDeleteMultiple = new EventEmitter<any[]>();
  @Output() onImportItems = new EventEmitter<any>();

  @ViewChild('dt') dt!: Table;

  itemDialog: boolean = false;
  selectedItems: any[] = [];
  item: any = {};
  submitted: boolean = false;
  exportColumns: ExportColumn[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.exportColumns = this.cols.map((col) => ({
      title: col.customExportHeader || col.header,
      dataKey: col.field
    }));
  }

  exportCSV($event: MouseEvent) {
    this.dt.exportCSV();
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
  }

  editItem(item: any) {
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the selected ${this.entityName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDeleteMultiple.emit(this.selectedItems);
        this.selectedItems = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `${this.entityName} Deleted`,
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${item[this.nameField]}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete.emit(item);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `${this.entityName.slice(0, -1)} Deleted`,
          life: 3000
        });
      }
    });
  }

  saveItem() {
    this.submitted = true;

    // Validation could be handled differently based on requirements
    if (this.item[this.nameField]?.trim()) {
      this.onSave.emit(this.item);
      this.itemDialog = false;
      this.item = {};
    }
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (this.severityMap[status]) {
      return this.severityMap[status] as 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
    }

    // Default severities if not provided
    switch (status) {
      case 'INSTOCK':
      case 'ACTIVE':
      case 'COMPLETED':
        return 'success';
      case 'LOWSTOCK':
      case 'PENDING':
      case 'IN_PROGRESS':
        return 'warn';
      case 'OUTOFSTOCK':
      case 'INACTIVE':
      case 'FAILED':
        return 'danger';
      default:
        return 'info';
    }
  }

  onImport(event: any) {
    this.onImportItems.emit(event);
  }
}
