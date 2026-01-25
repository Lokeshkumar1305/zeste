import { Component, OnInit } from '@angular/core';
import { DynamicFieldService, DynamicField } from '../../../shared/services/dynamic-field.service';

@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-inputs.component.html',
  styleUrls: ['./dynamic-inputs.component.scss']
})
export class DynamicInputsComponent implements OnInit {
  fields: DynamicField[] = [];

  newField: Partial<DynamicField> = {
    label: '',
    type: 'text',
    page: 'product',
    required: false
  };

  constructor(private fieldService: DynamicFieldService) { }

  ngOnInit(): void {
    this.fieldService.fields$.subscribe(f => this.fields = f);
  }

  addField() {
    if (this.newField.label) {
      const field: DynamicField = {
        id: 'field_' + Date.now(),
        label: this.newField.label!,
        type: this.newField.type as any,
        page: this.newField.page as any,
        required: !!this.newField.required
      };
      this.fieldService.addField(field);
      this.newField = { label: '', type: 'text', page: 'product', required: false };
    }
  }

  removeField(id: string) {
    this.fieldService.removeField(id);
  }
}
