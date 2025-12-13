import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-management-modal',
  templateUrl: './payment-management-modal.component.html',
  styleUrls: ['./payment-management-modal.component.scss']
})
export class PaymentManagementModalComponent {
  payment = {
    tenantName: '',
    roomNumber: '',
    amount: null,
    paymentType: 'Rent',
    dueDate: new Date(),
    status: 'Pending',
    paymentMethod: '',
    notes: ''
  };

  constructor(
    public dialogRef: MatDialogRef<PaymentManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.payment) {
      this.payment = { ...data.payment };
      // Ensure dueDate is a Date object
      if (this.payment.dueDate && !(this.payment.dueDate instanceof Date)) {
        this.payment.dueDate = new Date(this.payment.dueDate);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Optional: Convert dueDate to ISO string or format as needed
    const result = {
      ...this.payment,
      dueDate: this.payment.dueDate ? new Date(this.payment.dueDate).toISOString().split('T')[0] : null
    };
    this.dialogRef.close(result);
  }
}