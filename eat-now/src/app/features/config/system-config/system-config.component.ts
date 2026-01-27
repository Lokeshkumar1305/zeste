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
    { id: 1, title: 'App Identity', subtitle: 'General info & About us', icon: 'bi bi-info-circle-fill', status: 'active' },
    { id: 2, title: 'Branding & UI', subtitle: 'Appearance & Themes', icon: 'bi bi-palette-fill', status: 'pending' },
    { id: 3, title: 'Finance & Taxes', subtitle: 'Currency, Taxes & Billing', icon: 'bi bi-cash-coin', status: 'pending' },
    { id: 4, title: 'Communication', subtitle: 'Email & Notification setup', icon: 'bi bi-envelope-check-fill', status: 'pending' },
    { id: 5, title: 'Connectivity', subtitle: 'Gateway & Cloud Storage', icon: 'bi bi-signpost-split-fill', status: 'pending' },
    { id: 6, title: 'Security & Backup', subtitle: 'Keys & DB Maintenance', icon: 'bi bi-shield-lock-fill', status: 'pending' },
    { id: 7, title: 'Distribution', subtitle: 'PWA & Desktop Apps', icon: 'bi bi-cloud-download-fill', status: 'pending' },
    { id: 8, title: 'Hostel Settings', subtitle: 'Hostel profile & rules', icon: 'bi bi-building-fill', status: 'pending' },
    { id: 9, title: 'Tenant Protocol', subtitle: 'Application & UI workflows', icon: 'bi bi-person-badge-fill', status: 'pending' }
  ];

  presetColors = [
    '#002B61', '#8A4A9F', '#2A69A6', '#28A745', '#F39C12', '#DC3545', '#17A2B8', '#343A40', '#FF6F61', '#6B5B95'
  ];

  // IDENTITY SETTINGS
  identitySettings = {
    appName: 'Zeste SaaS',
    version: '2.4.0',
    aboutUs: 'Zeste is a leading Hostel Management SaaS providing end-to-end automation for property owners and tenants.',
    companyName: 'Zeste Technologies Pvt Ltd',
    supportEmail: 'support@zeste.io',
    website: 'https://zeste.io'
  };

  // FINANCE SETTINGS
  financeSettings = {
    currency: 'INR (₹)',
    language: 'English (India)',
    taxEnabled: true,
    gstNumber: '',
    taxPercentage: 18,
    financialYearStart: 'April',
    invoicePrefix: 'ZST-'
  };

  // COMMUNICATION
  commSettings = {
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    senderName: 'Zeste Admin',
    senderEmail: 'no-reply@zeste.io',
    notifyOnNewBooking: true,
    notifyOnPayment: true,
    smsGatewayEnabled: false
  };

  // CONNECTIVITY
  connSettings = {
    paymentGateway: 'razorpay',
    razorpayKeyId: '',
    razorpaySecret: '',
    storageProvider: 's3',
    s3Bucket: 'zeste-assets',
    s3Region: 'ap-south-1'
  };

  // SECURITY
  securitySettings = {
    aesKey: 'df-458-rt-99',
    autoBackup: true,
    backupFrequency: 'Daily',
    retentionDays: 30,
    lastBackup: '2024-03-20 04:00 AM'
  };

  // DISTRIBUTION
  distSettings = {
    pwaEnabled: true,
    pwaVersion: '1.0.2',
    desktopAppWindows: 'https://get.zeste.io/win',
    desktopAppMac: 'https://get.zeste.io/mac',
    appStoreLink: '',
    playStoreLink: ''
  };

  // HOSTEL SETTINGS
  hostelSettings = {
    propertyName: 'Zeste Elite Residency',
    hostelEmail: 'elite.residency@zeste.io',
    hostelMobile: '9876543210',
    hostelAddress: '123, Jubilee Hills, Hyderabad, 500033',
    propertyType: 'Co-living / Hostel',
    totalCapacity: 200,
    checkInTime: '10:00 AM',
    checkOutTime: '09:00 AM',
    amenities: ['Wifi', 'Laundry', 'Gym', 'Meals']
  };

  // TENANT PROTOCOL
  tenantSettings = {
    autoApproveApplications: false,
    requireAadhar: true,
    securityDepositMonths: 1,
    noticePeriodDays: 30,
    allowPartialPayments: false,

    // Owner-managed Tenant Rules
    rentDueDate: 5, // 5th of every month
    latePaymentFine: 100, // INR per day
    electricityChargeType: 'Fixed', // Fixed or Unit-base
    electricityFixedRate: 500,
    allowRoommateRequests: true,
    visitorEntryRestriction: 'Strict', // Open, Strictly 8PM, No-Entry
    laundryLimitWeekly: 2,
    guestStayAllowed: true,
    guestChargePerNight: 500
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
    this.activeStep = stepId;
    this.updateStepStatus();
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

  saveSettings() {
    console.log('Final System Config:', {
      identity: this.identitySettings,
      finance: this.financeSettings,
      comm: this.commSettings,
      conn: this.connSettings,
      security: this.securitySettings,
      dist: this.distSettings,
      hostel: this.hostelSettings,
      tenant: this.tenantSettings
    });
  }
}
