import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';
import { Subscription } from 'rxjs';

import { RoomConfigService, RoomType } from '../../shared/services/room-config.service';
import { BedsService } from '../../shared/services/beds.service';

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

  roomTypes: RoomType[] = [];
  floors: string[] = [];
  statuses = ['Available', 'Occupied', 'Maintenance'];
  amenityOptions: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<RoomManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private roomConfigService: RoomConfigService,
    private bedsService: BedsService
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
      this.roomTypes = types;
      if (this.roomTypes.length > 0 && !this.room.type) {
        this.room.type = this.roomTypes[0].name;
        this.onRoomTypeChange(this.room.type);
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

  onRoomTypeChange(roomTypeName: string): void {
    const bedCount = this.roomConfigService.getBedCountForRoomType(roomTypeName);
    this.room.beds = bedCount;
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
      alert('Please fill in all required fields');
      return;
    }

    if (!this.room.floor || this.room.beds === null || this.room.beds <= 0) {
      alert('Please select a valid floor and ensure beds count is valid');
      return;
    }

    this.bedsService.addBedsForRoom(
      this.room.roomNumber,
      this.room.floor,
      this.room.type,
      this.room.beds,
      this.room.monthlyRent,
      this.room.amenities
    );

    this.dialogRef.close(this.room);
  }
}
