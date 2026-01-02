import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  InventoryService,
  InventoryItem
} from '../../shared/services/inventory.service';

type StockStatus = 'all' | 'ok' | 'low' | 'out';

@Component({
  selector: 'app-inventory-stocks',
  templateUrl: './inventory-stocks.component.html',
  styleUrls: ['./inventory-stocks.component.scss']
})
export class InventoryStocksComponent implements OnInit, OnDestroy {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];

  searchTerm = '';
  filterCategory = '';
  filterStatus: StockStatus = 'all';

  categories: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.items = items || [];
        this.filterItems();
      });

    this.inventoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cats => {
        this.categories = cats || [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Summary counts
  get inStockCount(): number {
    return this.items.filter(i => i.currentStock > i.minStockLevel).length;
  }

  get lowStockCount(): number {
    return this.items.filter(
      i => i.currentStock <= i.minStockLevel && i.currentStock > 0
    ).length;
  }

  get outOfStockCount(): number {
    return this.items.filter(i => i.currentStock === 0).length;
  }

  // Filtering
  filterItems(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredItems = this.items.filter(item => {
      const matchesSearch =
        !term || item.name.toLowerCase().includes(term);

      const matchesCategory =
        !this.filterCategory ||
        String(item.categoryId) === String(this.filterCategory);

      const status = this.getStockStatus(item);
      const matchesStatus =
        this.filterStatus === 'all' || this.filterStatus === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  // Status helpers
  getStockStatus(item: InventoryItem): Exclude<StockStatus, 'all'> {
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

  // Total value
  getTotalValue(): number {
    return this.filteredItems.reduce(
      (sum, item) => sum + item.currentStock * (item.costPrice || 0),
      0
    );
  }

  // TrackBy for performance
  trackByItemId(index: number, item: InventoryItem): any {
    return item.id ?? index;
  }
}