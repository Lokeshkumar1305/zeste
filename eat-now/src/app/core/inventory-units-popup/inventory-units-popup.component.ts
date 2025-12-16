import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unit, InventoryService } from '../../shared/services/inventory.service';

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

  // ← RENAME exampleUnits → quickUnits to match template
  quickUnits = [
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

  // ← ADD THIS METHOD (or rename selectExample → applyQuickUnit)
  applyQuickUnit(example: any): void {
    this.unit.name = example.name;
    this.unit.shortName = example.short;
    this.unit.description = example.desc || '';
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