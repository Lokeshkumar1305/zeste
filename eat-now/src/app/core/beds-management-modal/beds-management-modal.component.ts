import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-beds-management-modal',
  templateUrl: './beds-management-modal.component.html',
  styleUrl: './beds-management-modal.component.scss'
})
export class BedsManagementModalComponent {
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
    public dialogRef: MatDialogRef<BedsManagementModalComponent>,
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