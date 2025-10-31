import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-amenities-management-modal',
  templateUrl: './amenities-management-modal.component.html',
  styleUrl: './amenities-management-modal.component.scss',
})
export class AmenitiesManagementModalComponent {
  amenities: string[] = [];
  pendingAmenity = '';

  constructor(
    public dialogRef: MatDialogRef<AmenitiesManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { amenities: string[] }
  ) {
    this.amenities = data?.amenities ? [...data.amenities] : [];
  }

  addAmenity(): void {
    const value = this.pendingAmenity?.trim();
    if (!value) return;
    if (!this.amenities.includes(value)) {
      this.amenities.push(value);
    }
    this.pendingAmenity = '';
  }

  removeAmenity(amenity: string): void {
    this.amenities = this.amenities.filter(a => a !== amenity);
  }

  save(): void {
    this.dialogRef.close(this.amenities);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}