import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tenant-management-modal',
  templateUrl: './tenant-management-modal.component.html',
  styleUrl: './tenant-management-modal.component.scss'
})
export class TenantManagementModalComponent {
room = {
    id: '',
    owner: '',
    status: 'Open',
    type: 'Dispute',
    subType: '',
    priority: 'Medium',
    createdDate: new Date().toISOString().slice(0, 16),
    description: '',
  };

  statuses = ['Open', 'Closed', 'On Hold'];
  types = ['Dispute', 'Inquiry', 'Escalation'];
  priorities = ['Low', 'Medium', 'High'];

  constructor(
    public dialogRef: MatDialogRef<TenantManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.room) {
      this.room = { ...data.room };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.room);
  }
}
