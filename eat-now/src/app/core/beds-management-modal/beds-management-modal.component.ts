import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bed } from '../../shared/services/beds.service';

@Component({
  selector: 'app-beds-management-modal',
  templateUrl: './beds-management-modal.component.html',
  styleUrls: ['./beds-management-modal.component.scss'],
})
export class BedsManagementModalComponent implements OnInit {
  bed: Bed = {
    id: '',
    roomNumber: '',
    floor: '',
    bedNumber: '',
    roomType: '',
    rent: 0,
    status: 'Available',
    amenities: [],
  };

  statuses: Array<'Available' | 'Occupied' | 'Maintenance'> = ['Available', 'Occupied', 'Maintenance'];
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<BedsManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.bed) {
      this.bed = { ...data.bed };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.bed.id || !this.bed.roomNumber) {
      return;
    }
    this.dialogRef.close(this.bed);
  }
}