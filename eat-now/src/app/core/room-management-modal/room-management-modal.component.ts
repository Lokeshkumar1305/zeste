import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-management-modal',
  templateUrl: './room-management-modal.component.html',
  styleUrls: ['./room-management-modal.component.scss'],
})
export class RoomManagementModalComponent {
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
    public dialogRef: MatDialogRef<RoomManagementModalComponent>,
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