import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { 
  PurchaseOrder, 
  PurchaseOrderItem, 
  Supplier, 
  InventoryItem,
  InventoryService 
} from '../../shared/services/inventory.service';

@Component({
  selector: 'app-inventory-purchase-orders-modal',
  templateUrl: './inventory-purchase-orders-modal.component.html',
  styleUrls: ['./inventory-purchase-orders-modal.component.scss']
})
export class InventoryPurchaseOrdersModalComponent implements OnInit {
  
  order: Partial<PurchaseOrder> = {
    supplierId: '',
    items: [],
    orderDate: new Date(),
    expectedDate: new Date(),
    status: 'Draft',
    totalAmount: 0,
    notes: ''
  };

  suppliers: Supplier[] = [];
  availableItems: InventoryItem[] = [];
  isEditMode = false;

  // For adding items
  selectedItemId = '';
  selectedQuantity = 1;
  selectedUnitPrice = 0;

  constructor(
    public dialogRef: MatDialogRef<InventoryPurchaseOrdersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order?: PurchaseOrder },
    private inventoryService: InventoryService
  ) {
    if (data?.order) {
      this.order = { ...data.order, items: [...data.order.items] };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.inventoryService.suppliers$.subscribe(suppliers => {
      this.suppliers = suppliers.filter(s => s.isActive);
    });

    this.inventoryService.items$.subscribe(items => {
      this.availableItems = items.filter(i => i.isActive);
    });

    // Set default dates only for new orders
    if (!this.isEditMode) {
      const today = new Date();
      this.order.orderDate = today;
      
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      this.order.expectedDate = nextWeek;
    }
  }

  onItemSelect(): void {
    const item = this.availableItems.find(i => i.id === this.selectedItemId);
    if (item) {
      this.selectedUnitPrice = item.costPrice;
    }
  }

  addItem(): void {
    if (!this.selectedItemId || this.selectedQuantity <= 0) {
      return;
    }

    const item = this.availableItems.find(i => i.id === this.selectedItemId);
    if (!item) return;

    // Initialize items array if needed
    if (!this.order.items) {
      this.order.items = [];
    }

    // Check if item already exists
    const existingIndex = this.order.items.findIndex(i => i.itemId === this.selectedItemId);
    
    if (existingIndex >= 0) {
      // Update existing item
      this.order.items[existingIndex].quantity += this.selectedQuantity;
      this.order.items[existingIndex].totalPrice = 
        this.order.items[existingIndex].quantity * this.order.items[existingIndex].unitPrice;
    } else {
      // Add new item
      const orderItem: PurchaseOrderItem = {
        itemId: item.id,
        itemName: item.name,
        quantity: this.selectedQuantity,
        unitPrice: this.selectedUnitPrice,
        totalPrice: this.selectedQuantity * this.selectedUnitPrice
      };
      this.order.items.push(orderItem);
    }

    this.calculateTotal();
    this.resetItemForm();
  }

  removeItem(index: number): void {
    if (this.order.items) {
      this.order.items.splice(index, 1);
      this.calculateTotal();
    }
  }

  updateItemTotal(item: PurchaseOrderItem): void {
    item.totalPrice = item.quantity * item.unitPrice;
    this.calculateTotal();
  }

  calculateTotal(): void {
    if (this.order.items) {
      this.order.totalAmount = this.order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    } else {
      this.order.totalAmount = 0;
    }
  }

  resetItemForm(): void {
    this.selectedItemId = '';
    this.selectedQuantity = 1;
    this.selectedUnitPrice = 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.order.supplierId) {
      return;
    }

    if (!this.order.items || this.order.items.length === 0) {
      return;
    }

    const supplier = this.suppliers.find(s => s.id === this.order.supplierId);
    this.order.supplierName = supplier?.name;

    if (this.isEditMode && this.data.order?.id) {
      this.inventoryService.updatePurchaseOrder(this.data.order.id, this.order);
    } else {
      this.inventoryService.addPurchaseOrder(this.order as Omit<PurchaseOrder, 'id' | 'orderNumber' | 'createdAt'>);
    }

    this.dialogRef.close(this.order);
  }
}