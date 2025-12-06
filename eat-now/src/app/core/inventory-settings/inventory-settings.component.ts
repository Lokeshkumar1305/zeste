import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

interface AutoPurchaseRule {
  id: number;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  triggerThreshold: number;
  orderQuantity: number;
  isActive: boolean;
}

@Component({
  selector: 'app-inventory-settings',
  templateUrl: './inventory-settings.component.html',
  styleUrls: ['./inventory-settings.component.scss']
})
export class InventorySettingsComponent implements OnInit {
  
  // General Settings Form
  generalSettingsForm!: FormGroup;
  
  // Auto Purchase Settings Form
  autoPurchaseForm!: FormGroup;
  
  // Notification Settings
  notificationSettings: NotificationSetting[] = [
    {
      id: 'low_stock',
      name: 'Low Stock Alert',
      description: 'Get notified when items fall below minimum stock level',
      enabled: true,
      emailEnabled: true,
      smsEnabled: false
    },
    {
      id: 'out_of_stock',
      name: 'Out of Stock Alert',
      description: 'Get notified when items are completely out of stock',
      enabled: true,
      emailEnabled: true,
      smsEnabled: true
    },
    {
      id: 'order_placed',
      name: 'Purchase Order Placed',
      description: 'Get notified when a new purchase order is created',
      enabled: true,
      emailEnabled: true,
      smsEnabled: false
    },
    {
      id: 'order_received',
      name: 'Order Received',
      description: 'Get notified when ordered items are received',
      enabled: true,
      emailEnabled: true,
      smsEnabled: false
    },
    {
      id: 'expiry_alert',
      name: 'Item Expiry Alert',
      description: 'Get notified before items expire',
      enabled: false,
      emailEnabled: false,
      smsEnabled: false
    },
    {
      id: 'auto_purchase',
      name: 'Auto Purchase Order Created',
      description: 'Get notified when system auto-generates purchase orders',
      enabled: true,
      emailEnabled: true,
      smsEnabled: false
    }
  ];

  // Auto Purchase Rules
  autoPurchaseRules: AutoPurchaseRule[] = [
    {
      id: 1,
      categoryId: 1,
      categoryName: 'Cleaning Supplies',
      supplierId: 1,
      supplierName: 'ABC Suppliers',
      triggerThreshold: 10,
      orderQuantity: 50,
      isActive: true
    },
    {
      id: 2,
      categoryId: 2,
      categoryName: 'Food & Beverages',
      supplierId: 2,
      supplierName: 'Fresh Foods Ltd',
      triggerThreshold: 20,
      orderQuantity: 100,
      isActive: true
    },
    {
      id: 3,
      categoryId: 3,
      categoryName: 'Toiletries',
      supplierId: 3,
      supplierName: 'Hygiene Plus',
      triggerThreshold: 15,
      orderQuantity: 75,
      isActive: false
    }
  ];

  // Categories and Suppliers for dropdowns
  categories = [
    { id: 1, name: 'Cleaning Supplies' },
    { id: 2, name: 'Food & Beverages' },
    { id: 3, name: 'Toiletries' },
    { id: 4, name: 'Stationery' },
    { id: 5, name: 'Furniture' },
    { id: 6, name: 'Electronics' },
    { id: 7, name: 'Bedding & Linens' }
  ];

  suppliers = [
    { id: 1, name: 'ABC Suppliers' },
    { id: 2, name: 'Fresh Foods Ltd' },
    { id: 3, name: 'Hygiene Plus' },
    { id: 4, name: 'Office World' },
    { id: 5, name: 'Home Essentials' }
  ];

  // UI State
  activeTab: string = 'general';
  isLoading: boolean = false;
  showAddRuleDialog: boolean = false;
  editingRule: AutoPurchaseRule | null = null;

  // Email Recipients
  emailRecipients: string[] = ['admin@hostel.com', 'manager@hostel.com'];
  newEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadSettings();
  }

  initializeForms(): void {
    this.generalSettingsForm = this.fb.group({
      defaultLowStockThreshold: [10, [Validators.required, Validators.min(1)]],
      defaultReorderQuantity: [50, [Validators.required, Validators.min(1)]],
      enableAutoPurchase: [true],
      autoPurchaseApprovalRequired: [true],
      stockCountFrequency: ['weekly'],
      enableBarcodeScanning: [true],
      enableExpiryTracking: [true],
      expiryAlertDays: [30, [Validators.required, Validators.min(1)]],
      defaultWarehouse: ['main'],
      currencySymbol: ['₹'],
      dateFormat: ['dd/MM/yyyy'],
      enableAuditLog: [true],
      maxOrderValue: [50000, [Validators.min(0)]],
      requirePOApproval: [true],
      poApprovalThreshold: [5000, [Validators.min(0)]]
    });

    this.autoPurchaseForm = this.fb.group({
      categoryId: ['', Validators.required],
      supplierId: ['', Validators.required],
      triggerThreshold: [10, [Validators.required, Validators.min(1)]],
      orderQuantity: [50, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  loadSettings(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // General Settings Methods
  saveGeneralSettings(): void {
    if (this.generalSettingsForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.showSnackBar('General settings saved successfully!', 'success');
      }, 1000);
    } else {
      this.markFormGroupTouched(this.generalSettingsForm);
      this.showSnackBar('Please fix the errors in the form', 'error');
    }
  }

  resetGeneralSettings(): void {
    this.generalSettingsForm.reset({
      defaultLowStockThreshold: 10,
      defaultReorderQuantity: 50,
      enableAutoPurchase: true,
      autoPurchaseApprovalRequired: true,
      stockCountFrequency: 'weekly',
      enableBarcodeScanning: true,
      enableExpiryTracking: true,
      expiryAlertDays: 30,
      defaultWarehouse: 'main',
      currencySymbol: '₹',
      dateFormat: 'dd/MM/yyyy',
      enableAuditLog: true,
      maxOrderValue: 50000,
      requirePOApproval: true,
      poApprovalThreshold: 5000
    });
    this.showSnackBar('Settings reset to default values', 'info');
  }

  // Notification Settings Methods
  toggleNotification(setting: NotificationSetting): void {
    setting.enabled = !setting.enabled;
    if (!setting.enabled) {
      setting.emailEnabled = false;
      setting.smsEnabled = false;
    }
    this.saveNotificationSettings();
  }

  toggleEmailNotification(setting: NotificationSetting): void {
    if (setting.enabled) {
      setting.emailEnabled = !setting.emailEnabled;
      this.saveNotificationSettings();
    }
  }

  toggleSmsNotification(setting: NotificationSetting): void {
    if (setting.enabled) {
      setting.smsEnabled = !setting.smsEnabled;
      this.saveNotificationSettings();
    }
  }

  saveNotificationSettings(): void {
    // Simulate API call
    setTimeout(() => {
      this.showSnackBar('Notification settings updated', 'success');
    }, 300);
  }

  // Email Recipients Methods
  addEmailRecipient(): void {
    const email = this.newEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      this.showSnackBar('Please enter an email address', 'error');
      return;
    }
    
    if (!emailRegex.test(email)) {
      this.showSnackBar('Please enter a valid email address', 'error');
      return;
    }
    
    if (this.emailRecipients.includes(email)) {
      this.showSnackBar('Email already exists in the list', 'error');
      return;
    }
    
    this.emailRecipients.push(email);
    this.newEmail = '';
    this.showSnackBar('Email recipient added', 'success');
  }

  removeEmailRecipient(email: string): void {
    const index = this.emailRecipients.indexOf(email);
    if (index > -1) {
      this.emailRecipients.splice(index, 1);
      this.showSnackBar('Email recipient removed', 'success');
    }
  }

  // Auto Purchase Rules Methods
  openAddRuleDialog(): void {
    this.editingRule = null;
    this.autoPurchaseForm.reset({
      categoryId: '',
      supplierId: '',
      triggerThreshold: 10,
      orderQuantity: 50,
      isActive: true
    });
    this.showAddRuleDialog = true;
  }

  openEditRuleDialog(rule: AutoPurchaseRule): void {
    this.editingRule = rule;
    this.autoPurchaseForm.patchValue({
      categoryId: rule.categoryId,
      supplierId: rule.supplierId,
      triggerThreshold: rule.triggerThreshold,
      orderQuantity: rule.orderQuantity,
      isActive: rule.isActive
    });
    this.showAddRuleDialog = true;
  }

  closeRuleDialog(): void {
    this.showAddRuleDialog = false;
    this.editingRule = null;
    this.autoPurchaseForm.reset();
  }

  saveRule(): void {
    if (this.autoPurchaseForm.valid) {
      const formValue = this.autoPurchaseForm.value;
      const category = this.categories.find(c => c.id === formValue.categoryId);
      const supplier = this.suppliers.find(s => s.id === formValue.supplierId);

      if (this.editingRule) {
        // Update existing rule
        const index = this.autoPurchaseRules.findIndex(r => r.id === this.editingRule!.id);
        if (index > -1) {
          this.autoPurchaseRules[index] = {
            ...this.editingRule,
            categoryId: formValue.categoryId,
            categoryName: category?.name || '',
            supplierId: formValue.supplierId,
            supplierName: supplier?.name || '',
            triggerThreshold: formValue.triggerThreshold,
            orderQuantity: formValue.orderQuantity,
            isActive: formValue.isActive
          };
        }
        this.showSnackBar('Rule updated successfully', 'success');
      } else {
        // Add new rule
        const newRule: AutoPurchaseRule = {
          id: Math.max(...this.autoPurchaseRules.map(r => r.id), 0) + 1,
          categoryId: formValue.categoryId,
          categoryName: category?.name || '',
          supplierId: formValue.supplierId,
          supplierName: supplier?.name || '',
          triggerThreshold: formValue.triggerThreshold,
          orderQuantity: formValue.orderQuantity,
          isActive: formValue.isActive
        };
        this.autoPurchaseRules.push(newRule);
        this.showSnackBar('Rule added successfully', 'success');
      }

      this.closeRuleDialog();
    } else {
      this.markFormGroupTouched(this.autoPurchaseForm);
    }
  }

  toggleRuleStatus(rule: AutoPurchaseRule): void {
    rule.isActive = !rule.isActive;
    this.showSnackBar(`Rule ${rule.isActive ? 'activated' : 'deactivated'}`, 'success');
  }

  deleteRule(rule: AutoPurchaseRule): void {
    if (confirm(`Are you sure you want to delete the rule for "${rule.categoryName}"?`)) {
      const index = this.autoPurchaseRules.findIndex(r => r.id === rule.id);
      if (index > -1) {
        this.autoPurchaseRules.splice(index, 1);
        this.showSnackBar('Rule deleted successfully', 'success');
      }
    }
  }

  // Utility Methods
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  // Export/Import Settings
  exportSettings(): void {
    const settings = {
      general: this.generalSettingsForm.value,
      notifications: this.notificationSettings,
      autoPurchaseRules: this.autoPurchaseRules,
      emailRecipients: this.emailRecipients
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-settings.json';
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showSnackBar('Settings exported successfully', 'success');
  }

  importSettings(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          // Apply imported settings
          if (settings.general) {
            this.generalSettingsForm.patchValue(settings.general);
          }
          if (settings.notifications) {
            this.notificationSettings = settings.notifications;
          }
          if (settings.autoPurchaseRules) {
            this.autoPurchaseRules = settings.autoPurchaseRules;
          }
          if (settings.emailRecipients) {
            this.emailRecipients = settings.emailRecipients;
          }
          this.showSnackBar('Settings imported successfully', 'success');
        } catch (error) {
          this.showSnackBar('Invalid settings file', 'error');
        }
      };
      
      reader.readAsText(file);
    }
  }
}