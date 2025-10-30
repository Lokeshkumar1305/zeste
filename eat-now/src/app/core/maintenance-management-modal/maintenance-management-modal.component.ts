import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-maintenance-management-modal',
  templateUrl: './maintenance-management-modal.component.html',
  styleUrl: './maintenance-management-modal.component.scss'
})
export class MaintenanceManagementModalComponent {
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
    public dialogRef: MatDialogRef<MaintenanceManagementModalComponent>,
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
