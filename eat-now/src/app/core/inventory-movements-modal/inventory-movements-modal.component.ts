// inventory-movements-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryItem, Movement, InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-inventory-movements-modal',
  templateUrl: './inventory-movements-modal.component.html',
  styleUrls: ['./inventory-movements-modal.component.scss']
})
export class InventoryMovementsModalComponent implements OnInit {
  
  movement: Partial<Movement> = {
    itemId: '',
    type: 'IN',
    quantity: 1,
    date: new Date(),
    reason: '',
    reference: '',
    performedBy: '',
    notes: ''
  };

  items: InventoryItem[] = [];
  selectedItem: InventoryItem | null = null;
  
  movementReasons = {
    IN: [
      'Purchased from supplier',
      'Returned by user',
      'Stock adjustment (found extra)',
      'Received as donation',
      'Transferred from another location',
      'Other'
    ],
    OUT: [
      'Used in hostel',
      'Given to resident',
      'Damaged/Expired',
      'Stolen/Lost',
      'Stock adjustment (count correction)',
      'Transferred to another location',
      'Other'
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<InventoryMovementsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemId?: string },
    private inventoryService: InventoryService
  ) {
    if (data?.itemId) {
      this.movement.itemId = data.itemId;
    }
  }

  ngOnInit(): void {
    this.inventoryService.items$.subscribe(items => {
      this.items = items.filter(i => i.isActive);
      this.updateSelectedItem();
    });

    // Generate reference number
    this.movement.reference = this.generateReference();
  }

  generateReference(): string {
    const prefix = this.movement.type === 'IN' ? 'IN' : 'OUT';
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }

  onTypeChange(): void {
    this.movement.reason = '';
    this.movement.reference = this.generateReference();
  }

  onItemChange(): void {
    this.updateSelectedItem();
  }

  updateSelectedItem(): void {
    this.selectedItem = this.items.find(i => i.id === this.movement.itemId) || null;
  }

  getNewStock(): number {
    if (!this.selectedItem) return 0;
    const qty = this.movement.quantity || 0;
    return this.movement.type === 'IN' 
      ? this.selectedItem.currentStock + qty
      : Math.max(0, this.selectedItem.currentStock - qty);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.movement.itemId || !this.movement.quantity || !this.movement.reason) {
      alert('Please fill in all required fields: Item, Quantity, and Reason');
      return;
    }

    if (this.movement.type === 'OUT' && this.selectedItem) {
      if (this.movement.quantity > this.selectedItem.currentStock) {
        alert(`Not enough stock! Current stock is ${this.selectedItem.currentStock}`);
        return;
      }
    }

    this.movement.itemName = this.selectedItem?.name;
    this.movement.date = new Date();

    this.inventoryService.addMovement(this.movement as Omit<Movement, 'id'>);
    this.dialogRef.close(this.movement);
  }
}