// inventory-suppliers-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supplier, InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-inventory-suppliers-modal',
  templateUrl: './inventory-suppliers-modal.component.html',
  styleUrls: ['./inventory-suppliers-modal.component.scss']
})
export class InventorySuppliersModalComponent implements OnInit {

  supplier: Partial<Supplier> = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gst: '',           // ← ADD THIS LINE
    isActive: true
  };

  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<InventorySuppliersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { supplier?: Supplier },
    private inventoryService: InventoryService
  ) {
    if (data?.supplier) {
      // Spread all properties including gst (if it exists in the original)
      this.supplier = { ...data.supplier };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.supplier.name || !this.supplier.phone) {
      alert('Please fill in the supplier name and phone number');
      return;
    }

    if (this.isEditMode && this.data.supplier?.id) {
      this.inventoryService.updateSupplier(this.data.supplier.id, this.supplier);
    } else {
      this.inventoryService.addSupplier(this.supplier as Omit<Supplier, 'id' | 'createdAt'>);
    }

    this.dialogRef.close(this.supplier);
  }
}