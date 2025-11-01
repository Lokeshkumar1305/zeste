import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomConfigService } from '../../shared/services/room-config.service';


@Component({
  selector: 'app-room-type-management-modal',
  templateUrl: './room-type-management-modal.component.html',
  styleUrl: './room-type-management-modal.component.scss'
})
export class RoomTypeManagementModalComponent {

  room = {
    roomType: '',
    beds: '',
    description: '',
  };

  constructor(
    public dialogRef: MatDialogRef<RoomTypeManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomConfigService: RoomConfigService
  ) {
    if (data?.room) {
      this.room = { ...data.room };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.room.roomType && this.room.beds) {
      this.roomConfigService.addRoomType(this.room.roomType);
      this.dialogRef.close(this.room);
    }
  }
}
