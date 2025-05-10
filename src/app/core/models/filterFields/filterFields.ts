export interface FilterField {
  key: string;
  type: 'text' | 'number' | 'select';
  placeholder: string;
  options?: string[];
}
