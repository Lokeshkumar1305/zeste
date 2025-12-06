import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryItem, InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-inventory-stocks-modal',
  templateUrl: './inventory-stocks-modal.component.html',
  styleUrls: ['./inventory-stocks-modal.component.scss']
})
export class InventoryStocksModalComponent implements OnInit {

  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm = '';
  filterCategory = '';
  filterStatus = 'all';
  categories: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<InventoryStocksModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.inventoryService.items$.subscribe(items => {
      this.items = items;
      this.filterItems();
    });

    this.inventoryService.categories$.subscribe(cats => {
      this.categories = cats;
    });
  }

  // ✅ Add these getter methods for summary counts
  get inStockCount(): number {
    return this.items.filter(i => i.currentStock > i.minStockLevel).length;
  }

  get lowStockCount(): number {
    return this.items.filter(i => i.currentStock <= i.minStockLevel && i.currentStock > 0).length;
  }

  get outOfStockCount(): number {
    return this.items.filter(i => i.currentStock === 0).length;
  }

  filterItems(): void {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.filterCategory || item.categoryId === this.filterCategory;
      const matchesStatus = this.filterStatus === 'all' ||
        (this.filterStatus === 'low' && item.currentStock <= item.minStockLevel) ||
        (this.filterStatus === 'ok' && item.currentStock > item.minStockLevel);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  getStockStatus(item: InventoryItem): string {
    if (item.currentStock === 0) return 'out';
    if (item.currentStock <= item.minStockLevel) return 'low';
    return 'ok';
  }

  getStockStatusText(item: InventoryItem): string {
    const status = this.getStockStatus(item);
    if (status === 'out') return 'Out of Stock';
    if (status === 'low') return 'Low Stock';
    return 'In Stock';
  }

  getTotalValue(): number {
    return this.filteredItems.reduce((sum, item) =>
      sum + (item.currentStock * item.costPrice), 0
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}