import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tenant-management-modal',
  templateUrl: './tenant-management-modal.component.html',
  styleUrl: './tenant-management-modal.component.scss'
})
export class TenantManagementModalComponent {
tenant: any = {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    roomNumber: '101',
    checkinDate: new Date('2024-01-15'),
    status: 'Active',
    monthlyRent: 8000,
    securityDeposit: 16000,
    emergencyContact: '+91 9876543211',
    occupation: 'Software Engineer',
    idProofType: 'Aadhar Card',
    idProofFile: null, // Will hold File object
    address: '123 Main St, City'
  };

  constructor(
    public dialogRef: MatDialogRef<TenantManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.tenant) {
      this.tenant = { ...data.tenant };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const result = { ...this.tenant };

    // Convert date
    if (result.checkinDate instanceof Date) {
      result.checkinDate = result.checkinDate.toISOString().split('T')[0];
    }

    this.dialogRef.close(result);
  }

  onIdProofTypeChange(): void {
    // Reset file when type changes
    this.tenant.idProofFile = null;
  }

  onIdFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      this.tenant.idProofFile = file;
    } else if (file) {
      alert('File size must be under 5MB');
    }
  }

  removeIdProof(): void {
    this.tenant.idProofFile = null;
  }

  downloadFile(file: File): void {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
