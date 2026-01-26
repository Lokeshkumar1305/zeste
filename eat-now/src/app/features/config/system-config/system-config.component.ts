import { Component, OnInit } from '@angular/core';
import { DynamicFieldService, DynamicField } from '../../../shared/services/dynamic-field.service';
import { ThemeService } from '../../../shared/services/theme.service';

interface ConfigStep {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
}

@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.scss']
})
export class SystemConfigComponent implements OnInit {
  activeStep: number = 1;
  themeState: any;

  steps: ConfigStep[] = [
    { id: 1, title: 'System Configuration', subtitle: 'Basic project settings', icon: 'bi bi-gear-fill', status: 'active' },
    { id: 2, title: 'Storage Configuration', subtitle: 'Cloud, Local, or SFTP storage', icon: 'bi bi-hdd-network', status: 'pending' },
    { id: 3, title: 'Email Configuration', subtitle: 'Email provider setup', icon: 'bi bi-envelope-fill', status: 'pending' },
    { id: 4, title: 'Data Source & Collection', subtitle: 'PEM with file attachment', icon: 'bi bi-database-fill', status: 'pending' },
    { id: 5, title: 'Theme Configuration', subtitle: 'Visual appearance & branding', icon: 'bi bi-palette-fill', status: 'pending' }
  ];

  presetColors = [
    '#003B8A', // Zeste Primary
    '#8A4A9F', // Purple
    '#2A69A6', // Blue
    '#28A745', // Green
    '#F39C12', // Orange
    '#DC3545', // Red
    '#17A2B8', // Cyan
    '#343A40', // Dark
    '#FF6F61', // Coral
    '#6B5B95'  // Royal
  ];

  systemSettings = {
    collectionName: 'Zeste Project',
    environment: 'Production',
    aesKey: 'df-458-rt-99',
    description: 'Main production configuration for Zeste Enterprise platform.',
    organizationName: 'Zeste Enterprise',
    timezone: 'IST (UTC+05:30)',
    currency: 'INR (₹)',
    dateFormat: 'DD/MM/YYYY',
    pwaEnabled: true,
    autoBackup: false
  };

  storageConfig = {
    provider: 'cloud',
    options: [
      { id: 'cloud', title: 'Cloud Storage', subtitle: 'AWS S3 cloud storage', icon: 'bi bi-cloud' },
      { id: 'local', title: 'Local Storage', subtitle: 'On-premise directory', icon: 'bi bi-hdd' },
      { id: 'sftp', title: 'SFTP Server', subtitle: 'Remote SFTP storage', icon: 'bi bi-server' }
    ]
  };

  emailConfig = {
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    useSsl: true,
    senderEmail: 'admin@zeste.com'
  };

  dynamicFields: DynamicField[] = [];

  constructor(
    private fieldService: DynamicFieldService,
    private theme: ThemeService
  ) { }

  ngOnInit(): void {
    this.themeState = this.theme.getState();

    this.fieldService.fields$.subscribe(fields => {
      this.dynamicFields = fields.filter(f => f.page === 'system');
    });
  }

  setStep(stepId: number) {
    if (stepId < this.activeStep || this.steps[stepId - 2]?.status === 'completed' || stepId === this.activeStep) {
      this.activeStep = stepId;
      this.updateStepStatus();
    }
  }

  nextStep() {
    if (this.activeStep < this.steps.length) {
      this.steps[this.activeStep - 1].status = 'completed';
      this.activeStep++;
      this.steps[this.activeStep - 1].status = 'active';
    } else {
      this.saveSettings();
    }
  }

  prevStep() {
    if (this.activeStep > 1) {
      this.activeStep--;
      this.updateStepStatus();
    }
  }

  updateStepStatus() {
    this.steps.forEach(step => {
      if (step.id < this.activeStep) step.status = 'completed';
      else if (step.id === this.activeStep) step.status = 'active';
      else step.status = 'pending';
    });
  }

  // Theme Config Methods
  setMode(mode: 'light' | 'dark'): void {
    this.theme.setMode(mode);
    this.themeState.mode = mode;
  }

  setBrandColor(color: string): void {
    this.theme.setBrandColor(color);
    this.themeState.color = color;
  }

  setFontFamily(font: string): void {
    this.theme.setFontFamily(font);
    this.themeState.fontFamily = font;
  }

  onCustomColorChange(event: any): void {
    const color = event.target.value;
    this.setBrandColor(color);
  }

  saveSettings() {
    console.log('Saving all configurations:', {
      system: this.systemSettings,
      storage: this.storageConfig,
      email: this.emailConfig,
      theme: this.themeState,
      dynamic: this.dynamicFields
    });
  }
}
