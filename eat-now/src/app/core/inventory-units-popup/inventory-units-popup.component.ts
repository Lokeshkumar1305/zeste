import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BedsService } from '../../shared/services/beds.service';
import { RoomConfigService } from '../../shared/services/room-config.service';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';
import { RoomManagementModalComponent } from '../room-management-modal/room-management-modal.component';
import { RoomType } from '../room-type-management/room-type-management.component';
import { Unit, InventoryService } from '../../shared/services/inventory.service';


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
  selector: 'app-inventory-units-popup',
  templateUrl: './inventory-units-popup.component.html',
  styleUrl: './inventory-units-popup.component.scss'
})
export class InventoryUnitsPopupComponent implements OnInit {
  
  unit: Partial<Unit> = {
    name: '',
    shortName: '',
    description: '',
    isActive: true
  };

  isEditMode = false;

  // Example units for hints
  exampleUnits = [
    { name: 'Pieces', short: 'pcs', desc: 'For counting items like chairs, tables' },
    { name: 'Kilograms', short: 'kg', desc: 'For measuring weight like rice, vegetables' },
    { name: 'Liters', short: 'L', desc: 'For measuring liquids like water, oil' },
    { name: 'Meters', short: 'm', desc: 'For measuring length like cloth, rope' },
    { name: 'Boxes', short: 'box', desc: 'For packaged items' }
  ];

  constructor(
    public dialogRef: MatDialogRef<InventoryUnitsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { unit?: Unit },
    private inventoryService: InventoryService
  ) {
    if (data?.unit) {
      this.unit = { ...data.unit };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {}

  selectExample(example: any): void {
    this.unit.name = example.name;
    this.unit.shortName = example.short;
    this.unit.description = example.desc;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.unit.name || !this.unit.shortName) {
      alert('Please fill in the unit name and short name');
      return;
    }

    if (this.isEditMode && this.data.unit?.id) {
      this.inventoryService.updateUnit(this.data.unit.id, this.unit);
    } else {
      this.inventoryService.addUnit(this.unit as Omit<Unit, 'id' | 'createdAt'>);
    }

    this.dialogRef.close(this.unit);
  }
}