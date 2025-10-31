import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';

export interface RoomDetails {
  roomNumber: string;
  type: string;
  monthlyRent: number | null;
  securityDeposit: number | null;
  floor: number | null;
  status: string;
  description: string;
  amenities: string[];
}

@Component({
  selector: 'app-room-management-modal',
  templateUrl: './room-management-modal.component.html',
  styleUrls: ['./room-management-modal.component.scss'],
})
export class RoomManagementModalComponent {
  room: RoomDetails = {
    roomNumber: '',
    type: 'Single',
    monthlyRent: null,
    securityDeposit: null,
    floor: null,
    status: 'Available',
    description: '',
    amenities: [],
  };

  types = ['Single', 'Double', 'Suite'];
  statuses = ['Available', 'Occupied', 'Maintenance'];
  amenityOptions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<RoomManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    if (data?.room) {
      this.room = { ...this.room, ...data.room };
    }
    if (data?.amenityOptions?.length) {
      this.amenityOptions = [...data.amenityOptions];
    }
  }

  openAmenityConfig(): void {
    const ref = this.dialog.open(AmenitiesManagementModalComponent, {
      width: '520px',
      data: { amenities: this.amenityOptions },
    });

    ref.afterClosed().subscribe((amenities: string[] | undefined) => {
      if (amenities) {
        this.amenityOptions = amenities;
        this.room.amenities = this.room.amenities.filter(a =>
          amenities.includes(a)
        );
      }
    });
  }

  onAmenityToggle(amenity: string, selected: boolean): void {
    const set = new Set(this.room.amenities);
    selected ? set.add(amenity) : set.delete(amenity);
    this.room.amenities = Array.from(set);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.room.roomNumber || this.room.monthlyRent === null) {
      return;
    }
    this.dialogRef.close(this.room);
  }
}