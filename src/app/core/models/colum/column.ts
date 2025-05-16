import {TemplateRef} from '@angular/core';

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'image' | 'currency' | 'rating' | 'tag' | 'custom';
  style?: string;
  currencyCode?: string;
  customExportHeader?: string;
  template?: TemplateRef<any>;
}
