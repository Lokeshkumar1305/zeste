import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { 
  InventoryItem, 
  Category, 
  Unit, 
  InventoryService 
} from '../../shared/services/inventory.service';

@Component({
  selector: 'app-inventory-items-modal',
  templateUrl: './inventory-items-modal.component.html',
  styleUrls: ['./inventory-items-modal.component.scss']
})
export class InventoryItemsModalComponent implements OnInit {
  
  item: Partial<InventoryItem> = {
    name: '',
    categoryId: '',
    unitId: '',
    sku: '',
    minStockLevel: 10,
    costPrice: 0,
    description: '',
    imageUrl: '',
    isActive: true
  };

  categories: Category[] = [];
  units: Unit[] = [];
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<InventoryItemsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: InventoryItem },
    private inventoryService: InventoryService
  ) {
    if (data?.item) {
      this.item = { ...data.item };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.inventoryService.categories$.subscribe(cats => {
      this.categories = cats.filter(c => c.isActive);
    });

    this.inventoryService.units$.subscribe(units => {
      this.units = units.filter(u => u.isActive);
    });

    // Auto-generate SKU for new items
    if (!this.isEditMode) {
      this.item.sku = this.generateSKU();
    }
  }

  generateSKU(): string {
    const prefix = 'ITM';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${random}`;
  }

  regenerateSKU(): void {
    this.item.sku = this.generateSKU();
  }

  // Helper method to get category name by ID - USE THIS IN TEMPLATE
  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  // Helper method to get unit name by ID - USE THIS IN TEMPLATE
  getUnitName(unitId: string | undefined): string {
    if (!unitId) return '';
    const unit = this.units.find(u => u.id === unitId);
    return unit ? unit.name : '';
  }

  // Helper method to get unit short name by ID
  getUnitShortName(unitId: string | undefined): string {
    if (!unitId) return '';
    const unit = this.units.find(u => u.id === unitId);
    return unit ? unit.shortName : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.item.name || !this.item.categoryId || !this.item.unitId) {
      alert('Please fill in all required fields: Item Name, Category, and Unit');
      return;
    }

    // Get names for display
    this.item.categoryName = this.getCategoryName(this.item.categoryId);
    this.item.unitName = this.getUnitName(this.item.unitId);

    if (this.isEditMode && this.data.item?.id) {
      this.inventoryService.updateItem(this.data.item.id, this.item);
    } else {
      this.inventoryService.addItem(this.item as Omit<InventoryItem, 'id' | 'createdAt' | 'currentStock'>);
    }

    this.dialogRef.close(this.item);
  }
}