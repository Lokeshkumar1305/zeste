import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';

import { Subscription } from 'rxjs';
import { RoomConfigService } from '../../shared/services/room-config.service';

export interface RoomDetails {
  roomNumber: string;
  type: string;
  monthlyRent: number | null;
  securityDeposit: number | null;
  floor: string | null;
  beds: number | null;
  status: string;
  description: string;
  amenities: string[];
}

@Component({
  selector: 'app-room-management-modal',
  templateUrl: './room-management-modal.component.html',
  styleUrls: ['./room-management-modal.component.scss'],
})
export class RoomManagementModalComponent implements OnInit, OnDestroy {
  room: RoomDetails = {
    roomNumber: '',
    type: '',
    monthlyRent: null,
    securityDeposit: null,
    floor: null,
    beds: null,
    status: 'Available',
    description: '',
    amenities: [],
  };

  types: string[] = [];
  floors: string[] = [];
  statuses = ['Available', 'Occupied', 'Maintenance'];
  amenityOptions: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<RoomManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private roomConfigService: RoomConfigService
  ) {
    if (data?.room) {
      this.room = { ...this.room, ...data.room };
    }
    if (data?.amenityOptions?.length) {
      this.amenityOptions = [...data.amenityOptions];
    }
  }

  ngOnInit(): void {
    const roomTypeSub = this.roomConfigService.roomTypes$.subscribe(types => {
      this.types = types;
      if (this.types.length > 0 && !this.room.type) {
        this.room.type = this.types[0];
      }
    });

    const floorsSub = this.roomConfigService.floors$.subscribe(floors => {
      this.floors = floors;
      if (this.floors.length > 0 && !this.room.floor) {
        this.room.floor = this.floors[0];
      }
    });

    this.subscriptions.push(roomTypeSub, floorsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    if (!this.room.roomNumber || this.room.monthlyRent === null || !this.room.type) {
      return;
    }
    this.dialogRef.close(this.room);
  }
}
