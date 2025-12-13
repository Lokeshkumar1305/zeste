import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomConfigService } from '../../shared/services/room-config.service';


@Component({
  selector: 'app-floors-management-modal',
  templateUrl: './floors-management-modal.component.html',
  styleUrl: './floors-management-modal.component.scss'
})
export class FloorsManagementModalComponent {
  floor = {
    floorNo: '',
    description: '',
  };

  constructor(
    public dialogRef: MatDialogRef<FloorsManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomConfigService: RoomConfigService
  ) {
    if (data?.floor) {
      this.floor = { ...data.floor };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.floor.floorNo) {
      this.roomConfigService.addFloor(this.floor.floorNo);
      this.dialogRef.close(this.floor);
    }
  }
}
