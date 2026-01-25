import { Component, OnInit } from '@angular/core';
import { DynamicFieldService, DynamicField } from '../../../shared/services/dynamic-field.service';

@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.scss']
})
export class SystemConfigComponent implements OnInit {
  systemSettings = {
    organizationName: 'Zeste Enterprise',
    timezone: 'IST (UTC+05:30)',
    currency: 'INR (₹)',
    dateFormat: 'DD/MM/YYYY',
    pwaEnabled: true,
    autoBackup: false
  };

  dynamicFields: DynamicField[] = [];

  constructor(private fieldService: DynamicFieldService) { }

  ngOnInit(): void {
    this.fieldService.fields$.subscribe(fields => {
      this.dynamicFields = fields.filter(f => f.page === 'system');
    });
  }

  saveSettings() {
    console.log('Saving settings:', this.systemSettings, 'Dynamic:', this.dynamicFields);
  }
}
