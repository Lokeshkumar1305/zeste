import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventoryItemsModalComponent } from '../inventory-items-modal/inventory-items-modal.component';

export type ItemStatusFilter = 'All' | 'Active' | 'Inactive';

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  categoryId: string;
  unitId: string;
  minStockLevel: number;
  costPrice?: number | null;
  description?: string;
  isActive: boolean;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface UnitOption {
  id: string;
  name: string;
  shortName: string;
}

@Component({
  selector: 'app-inventory-items',
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss'
})
export class InventoryItemsComponent implements OnInit {
  // Toolbar filters
  public selectedStatusFilter: ItemStatusFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Lookups
  public categories: CategoryOption[] = [];
  public units: UnitOption[] = [];

  // Data
  private allItems: InventoryItem[] = [];
  public filteredItems: InventoryItem[] = [];
  public pagedItems: InventoryItem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample categories
    this.categories = [
      { id: '1', name: 'Food & Groceries' },
      { id: '2', name: 'Cleaning Supplies' },
      { id: '3', name: 'Bedding & Linen' }
    ];

    // Seed sample units
    this.units = [
      { id: '1', name: 'Kilograms', shortName: 'kg' },
      { id: '2', name: 'Pieces', shortName: 'pcs' },
      { id: '3', name: 'Liters', shortName: 'L' }
    ];

    // Seed sample items
    this.allItems = [
      {
        id: '1',
        name: 'Basmati Rice',
        sku: 'FOOD-RICE-001',
        categoryId: '1',
        unitId: '1',
        minStockLevel: 50,
        costPrice: 80,
        description: '5kg bag basmati rice',
        isActive: true
      },
      {
        id: '2',
        name: 'Washing Powder',
        sku: 'CLEAN-LAUNDRY-001',
        categoryId: '2',
        unitId: '2',
        minStockLevel: 20,
        costPrice: 120,
        description: 'Laundry washing powder',
        isActive: true
      },
      {
        id: '3',
        name: 'Hand Soap',
        sku: 'CLEAN-SOAP-001',
        categoryId: '2',
        unitId: '2',
        minStockLevel: 30,
        costPrice: 25,
        description: 'Liquid hand wash',
        isActive: false
      },
      {
        id: '4',
        name: 'Milk',
        sku: 'FOOD-MILK-001',
        categoryId: '1',
        unitId: '3',
        minStockLevel: 10,
        costPrice: 55,
        description: 'Toned milk 1L pack',
        isActive: true
      },
      {
        id: '5',
        name: 'Bedsheet (Single)',
        sku: 'BED-SHEET-001',
        categoryId: '3',
        unitId: '2',
        minStockLevel: 10,
        costPrice: 400,
        description: 'Single bedsheet cotton',
        isActive: true
      },
      {
        id: '6',
        name: 'Pillow Cover',
        sku: 'BED-PILLOW-001',
        categoryId: '3',
        unitId: '2',
        minStockLevel: 20,
        costPrice: 80,
        description: 'Cotton pillow cover',
        isActive: false
      },
      {
        id: '7',
        name: 'Floor Cleaner',
        sku: 'CLEAN-FLOOR-001',
        categoryId: '2',
        unitId: '3',
        minStockLevel: 15,
        costPrice: 150,
        description: '1L floor cleaning solution',
        isActive: true
      }
    ];

    this.applyAllFilters();
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
  onSelectStatusChange(value: ItemStatusFilter): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: ItemStatusFilter[] = ['All', 'Active', 'Inactive'];
    const idx = order.indexOf(this.selectedStatusFilter);
    this.onSelectStatusChange(order[(idx + 1) % order.length]);
  }

  onReset(): void {
    this.selectedStatusFilter = 'All';
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
    this.filteredItems = this.applyStatusFilter(
      this.allItems,
      this.selectedStatusFilter
    );
    this.updatePagedItems();
  }

  private applyStatusFilter(
    list: InventoryItem[],
    selected: ItemStatusFilter
  ): InventoryItem[] {
    if (selected === 'All') return [...list];
    const isActive = selected === 'Active';
    return list.filter(i => i.isActive === isActive);
  }

  private updatePagedItems(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.filteredItems.slice(start, end);
  }

  /* ------------------- Lookup helpers ------------------- */
  getCategoryName(categoryId: string): string | undefined {
    return this.categories.find(c => c.id === categoryId)?.name;
  }

  getUnitDisplay(unitId: string): string | undefined {
    const u = this.units.find(x => x.id === unitId);
    return u ? `${u.name} (${u.shortName})` : undefined;
  }

  /** Simple ID generator based on existing numeric IDs */
  private generateId(): string {
    const numericIds = this.allItems
      .map(i => parseInt(i.id, 10))
      .filter(n => !isNaN(n));
    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return next.toString();
  }

  /* ------------------- Modal handling ------------------- */
  onAddNewItem(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryItemsModalComponent, {
      width,
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: {
        item: null,
        categories: this.categories,
        units: this.units
      }
    });

    dialogRef.afterClosed().subscribe(
      (newItem: InventoryItem | undefined) => {
        if (newItem) {
          if (!newItem.id) {
            newItem.id = this.generateId();
          }
          this.allItems.push(newItem);
          this.applyAllFilters();
          console.log('New Item Created:', newItem);
        }
      }
    );
  }

  onEditItem(item: InventoryItem): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryItemsModalComponent, {
      width,
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: {
        item: { ...item },
        categories: this.categories,
        units: this.units
      }
    });

    dialogRef.afterClosed().subscribe(
      (updated: InventoryItem | undefined) => {
        if (updated) {
          const idx = this.allItems.findIndex(i => i.id === item.id);
          if (idx > -1) {
            this.allItems[idx] = { ...updated };
            this.applyAllFilters();
          }
        }
      }
    );
  }

  onDeleteItem(item: InventoryItem): void {
    if (confirm(`Delete item "${item.name}"?`)) {
      this.allItems = this.allItems.filter(i => i.id !== item.id);
      this.applyAllFilters();
    }
  }
}