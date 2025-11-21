import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Expense {
  title: string;
  category: string;
  amount: number;
  date: Date | null;
  paymentMethod: string;
  vendor: string;
  receiptFile?: File;
  receiptFileName?: string;
  receiptUrl?: string;
  description: string;
  notes?: string;
}

@Component({
  selector: 'app-expenses-management-modal',
  templateUrl: './expenses-management-modal.component.html',
  styleUrls: ['./expenses-management-modal.component.scss']
})
export class ExpensesManagementModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  categories = ['Utilities', 'Rent', 'Supplies', 'Travel', 'Meals', 'Equipment', 'Marketing', 'Insurance', 'Taxes', 'Other'];
  paymentMethods = ['Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Cheque'];

  expense: Expense = {
    title: '',
    category: '',
    amount: 0,
    date: new Date(),
    paymentMethod: '',
    vendor: '',
    description: '',
    notes: ''
  };

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
      if (data.expense.receiptUrl) {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(data.expense.receiptUrl);
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.expense.receiptFile = file;
      this.expense.receiptFileName = file.name;
      this.updatePreview(file);
    }
  }

  private updatePreview(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviewUrl = null;
    }
  }

  removeFile(): void {
    this.expense.receiptFile = undefined;
    this.expense.receiptFileName = undefined;
    this.imagePreviewUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  downloadFile(): void {
    if (this.expense.receiptFile) {
      const url = window.URL.createObjectURL(this.expense.receiptFile);
      this.triggerDownload(url, this.expense.receiptFileName!);
    } else if (this.expense.receiptUrl) {
      this.triggerDownload(this.expense.receiptUrl, this.expense.receiptFileName || 'receipt');
    }
  }

  private triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (this.expense.receiptFile) {
      window.URL.revokeObjectURL(url);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const payload = { ...this.expense };
    this.dialogRef.close(payload);
  }
}