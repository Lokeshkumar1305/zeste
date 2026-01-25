import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DynamicField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  page: 'product' | 'system' | 'payment';
  required: boolean;
  value?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicFieldService {
  private fieldsSubject = new BehaviorSubject<DynamicField[]>(this.loadFields());
  fields$ = this.fieldsSubject.asObservable();

  constructor() { }

  private loadFields(): DynamicField[] {
    const saved = localStorage.getItem('dynamic-fields');
    return saved ? JSON.parse(saved) : [];
  }

  addField(field: DynamicField) {
    const current = this.fieldsSubject.value;
    const updated = [...current, field];
    this.save(updated);
  }

  removeField(id: string) {
    const updated = this.fieldsSubject.value.filter(f => f.id !== id);
    this.save(updated);
  }

  updateFieldValue(id: string, value: any) {
    const updated = this.fieldsSubject.value.map(f =>
      f.id === id ? { ...f, value } : f
    );
    this.save(updated);
  }

  private save(fields: DynamicField[]) {
    this.fieldsSubject.next(fields);
    localStorage.setItem('dynamic-fields', JSON.stringify(fields));
  }
}
