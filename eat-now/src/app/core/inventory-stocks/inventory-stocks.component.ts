import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  InventoryService,
  InventoryItem
} from '../../shared/services/inventory.service';
import { InventoryStocksModalComponent } from '../inventory-stocks-modal/inventory-stocks-modal.component';

export type StockFilter = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';

@Component({
  selector: 'app-inventory-stocks',
  templateUrl: './inventory-stocks.component.html',
  styleUrls: ['./inventory-stocks.component.scss']
})
export class InventoryStocksComponent implements OnInit {
  // Toolbar filter
  public selectedStockFilter: StockFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allItems: InventoryItem[] = [];
  public filteredItems: InventoryItem[] = [];
  public pagedItems: InventoryItem[] = [];

  constructor(
    private dialog: MatDialog,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.inventoryService.items$.subscribe(items => {
      // Load all items from the service
      this.allItems = items;
      this.applyAllFilters();
    });
  }

  /* ------------------- Pagination getters ------------------- */
  get totalItems(): number {
    return this.filteredItems.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get showingFrom(): number {
    return this.totalItems === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /* ------------------- UI Actions ------------------- */
  onSelectStockFilter(value: StockFilter): void {
    this.selectedStockFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: StockFilter[] = [
      'All',
      'In Stock',
      'Low Stock',
      'Out of Stock'
    ];
    const idx = order.indexOf(this.selectedStockFilter);
    this.onSelectStockFilter(order[(idx + 1) % order.length]);
  }

  onReset(): void {
    this.selectedStockFilter = 'All';
    this.pageSize = this.pageSizeOptions[0];
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = +size;
    this.currentPage = 1;
    this.updatePagedItems();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedItems();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedItems();
    }
  }

  trackByItemId(_: number, item: InventoryItem): string {
    return item.id;
  }

  /* ------------------- Core filtering + pagination ------------------- */
  private applyAllFilters(): void {
    // Optionally show only active items
    const base = this.allItems.filter(i => (i as any).isActive !== false);

    this.filteredItems = this.applyStatusFilter(
      base,
      this.selectedStockFilter
    );
    this.updatePagedItems();
  }

  private applyStatusFilter(
    list: InventoryItem[],
    selected: StockFilter
  ): InventoryItem[] {
    if (selected === 'All') return [...list];

    return list.filter(item => {
      const status = this.getStockStatus(item);
      if (selected === 'In Stock') return status === 'ok';
      if (selected === 'Low Stock') return status === 'low';
      return status === 'out';
    });
  }

  private updatePagedItems(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.filteredItems.slice(start, end);
  }

  /* ------------------- Stock helpers ------------------- */
  getStockStatus(item: InventoryItem): 'ok' | 'low' | 'out' {
    const current = item.currentStock ?? 0;
    const min = (item as any).minStockLevel ?? 0;

    if (current <= 0) return 'out';
    if (current <= min) return 'low';
    return 'ok';
  }

  getStockStatusText(item: InventoryItem): string {
    const s = this.getStockStatus(item);
    if (s === 'ok') return 'In Stock';
    if (s === 'low') return 'Low Stock';
    return 'Out of Stock';
  }

  /* ------------------- Modal handling ------------------- */
  onOpenStockOverview(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '800px';

    this.dialog.open(InventoryStocksModalComponent, {
      width,
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false
      // No data needed; modal uses InventoryService internally
    });
  }
}