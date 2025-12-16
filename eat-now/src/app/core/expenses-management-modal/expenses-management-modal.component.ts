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

  // NEW: Add these properties
  isImage = false;               // Determines if the uploaded file is an image
  attachmentName = '';           // File name to display
  attachmentSize: number = 0;    // File size in bytes

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
        // If editing an existing expense with a receipt URL, you may want to set name/size here too
        // (optional, depending on whether backend provides file name/size)
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.expense.receiptFile = file;
      this.expense.receiptFileName = file.name;

      // Update preview-related properties
      this.attachmentName = file.name;
      this.attachmentSize = file.size;
      this.isImage = file.type.startsWith('image/');

      this.updatePreview(file);
    }
  }

  private updatePreview(file: File): void {
    if (this.isImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-images (e.g., PDF), clear preview image
      this.imagePreviewUrl = null;
    }
  }

  removeFile(): void {
    this.expense.receiptFile = undefined;
    this.expense.receiptFileName = undefined;
    this.imagePreviewUrl = null;
    this.isImage = false;
    this.attachmentName = '';
    this.attachmentSize = 0;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Optional: handle existing receiptUrl when editing (if you have file name/size info)
  // You can call this in constructor if needed

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

  // NEW: Helper method to format file size (e.g., 1024 → 1 KB)
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const payload = { ...this.expense };
    this.dialogRef.close(payload);
  }
}