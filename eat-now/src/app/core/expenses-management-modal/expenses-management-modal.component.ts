import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Expense {
  title: string;
  category: string;
  amount: number;
  currency: string;
  date: Date | null;
  paymentMethod: string;
  vendor: string;
  costCenter?: string;
  taxAmount?: number;
  isRecurring: boolean;
  receiptFile?: File;
  receiptFileName?: string;
  description: string;
  notes?: string;
}

@Component({
  selector: 'app-expenses-management-modal',
  templateUrl: './expenses-management-modal.component.html',
  styleUrls: ['./expenses-management-modal.component.scss']
})
export class ExpensesManagementModalComponent {
  // Dropdown options
  categories = [
    'Utilities', 'Rent', 'Supplies', 'Travel', 'Meals', 'Equipment',
    'Marketing', 'Insurance', 'Taxes', 'Other'
  ];

  paymentMethods = ['Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Cheque'];

  currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'GBP', name: 'British Pound' }
  ];

  costCenters = ['Admin', 'IT', 'Marketing', 'Operations', 'HR', 'Sales'];

  // Model
  expense: Expense = {
    title: '',
    category: '',
    amount: 0,
    currency: 'USD',
    date: new Date(),
    paymentMethod: '',
    vendor: '',
    isRecurring: false,
    description: '',
    notes: ''
  };

  // Image preview URL
  imagePreviewUrl: SafeUrl | null = null;

  constructor(
    public dialogRef: MatDialogRef<ExpensesManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    if (data?.expense) {
      this.expense = { ...data.expense };
      if (typeof this.expense.date === 'string') {
        this.expense.date = new Date(this.expense.date);
      }

      // If editing and there's an existing image URL (from server), show preview
      if (data.expense.receiptUrl) {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(data.expense.receiptUrl);
      }
    }
  }

  // File handling with preview
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.expense.receiptFile = file;
      this.expense.receiptFileName = file.name;

      // Generate preview only for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files (like PDF), clear preview
        this.imagePreviewUrl = null;
      }
    }
  }

  // Dialog actions
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const payload = { ...this.expense };
    if (payload.receiptFile) {
      payload['receiptFile'] = payload.receiptFile;
    }
    this.dialogRef.close(payload);
  }
}