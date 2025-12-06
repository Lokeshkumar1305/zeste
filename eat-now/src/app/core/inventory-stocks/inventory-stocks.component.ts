import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InventoryStocksModalComponent } from '../inventory-stocks-modal/inventory-stocks-modal.component';
import { InventoryService, InventoryItem } from '../../shared/services/inventory.service';

type CaseStatus = 'Open' | 'Closed' | 'On Hold';
type CasePriority = 'Low' | 'Medium' | 'High';

export interface CaseItem {
  id: string;
  type: string;
  subtype: string;
  status: CaseStatus;
  priority: CasePriority;
  owner: string;
  date: Date;
}

@Component({
  selector: 'app-inventory-stocks',
  templateUrl: './inventory-stocks.component.html',
  styleUrls: ['./inventory-stocks.component.scss']
})
export class InventoryStocksComponent implements OnInit {

  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm = '';
  filterCategory = '';
  filterStatus = 'all';
  categories: any[] = [];

  constructor(
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

  // Getter methods for summary counts
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
      
      let matchesStatus = true;
      if (this.filterStatus === 'low') {
        matchesStatus = item.currentStock <= item.minStockLevel && item.currentStock > 0;
      } else if (this.filterStatus === 'ok') {
        matchesStatus = item.currentStock > item.minStockLevel;
      } else if (this.filterStatus === 'out') {
        matchesStatus = item.currentStock === 0;
      }

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
    
  }
}