import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventoryItemsCategoriesModalComponent } from '../inventory-items-categories-modal/inventory-items-categories-modal.component';

export type CategoryStatusFilter = 'All' | 'Active' | 'Inactive';

export interface InventoryCategory {
  id: string;
  name: string;
  parentId?: string | null;
  description?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-inventory-items-categories',
  templateUrl: './inventory-items-categories.component.html',
  styleUrl: './inventory-items-categories.component.scss'
})
export class InventoryItemsCategoriesComponent implements OnInit {
  // Toolbar filter
  public selectedStatusFilter: CategoryStatusFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allCategories: InventoryCategory[] = [];
  public filteredCategories: InventoryCategory[] = [];
  public pagedCategories: InventoryCategory[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample category data
    this.allCategories = [
      {
        id: '1',
        name: 'Food & Groceries',
        parentId: null,
        description: 'Rice, dal, oil, spices, vegetables',
        isActive: true
      },
      {
        id: '2',
        name: 'Cleaning Supplies',
        parentId: null,
        description: 'Soap, broom, mop, detergents',
        isActive: true
      },
      {
        id: '3',
        name: 'Snacks',
        parentId: '1',
        description: 'Biscuits, chips, chocolates',
        isActive: true
      },
      {
        id: '4',
        name: 'Beverages',
        parentId: '1',
        description: 'Tea, coffee, soft drinks, juices',
        isActive: true
      },
      {
        id: '5',
        name: 'Toiletries',
        parentId: null,
        description: 'Toothpaste, soap, shampoo',
        isActive: false
      },
      {
        id: '6',
        name: 'Laundry',
        parentId: '2',
        description: 'Washing powder, fabric softener',
        isActive: true
      },
      {
        id: '7',
        name: 'Paper Products',
        parentId: null,
        description: 'Tissues, napkins, toilet paper',
        isActive: false
      }
    ];

    this.applyAllFilters();
  }

  /* ------------------- Pagination getters ------------------- */
  get totalItems(): number {
    return this.filteredCategories.length;
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
  onSelectStatusChange(value: CategoryStatusFilter): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: CategoryStatusFilter[] = ['All', 'Active', 'Inactive'];
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
    this.updatePagedCategories();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedCategories();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedCategories();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedCategories();
    }
  }

  trackByCategoryId(_: number, category: InventoryCategory): string {
    return category.id;
  }

  /* ------------------- Core filtering + pagination ------------------- */
  private applyAllFilters(): void {
    this.filteredCategories = this.applyStatusFilter(
      this.allCategories,
      this.selectedStatusFilter
    );
    this.updatePagedCategories();
  }

  private applyStatusFilter(
    list: InventoryCategory[],
    selected: CategoryStatusFilter
  ): InventoryCategory[] {
    if (selected === 'All') return [...list];
    const isActive = selected === 'Active';
    return list.filter(c => c.isActive === isActive);
  }

  private updatePagedCategories(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCategories = this.filteredCategories.slice(start, end);
  }

  /* ------------------- Helpers ------------------- */
  getParentName(parentId?: string | null): string | undefined {
    if (!parentId) return undefined;
    const parent = this.allCategories.find(c => c.id === parentId);
    return parent?.name;
  }

  /** Simple ID generator based on existing numeric IDs */
  private generateId(): string {
    const numericIds = this.allCategories
      .map(c => parseInt(c.id, 10))
      .filter(n => !isNaN(n));
    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return next.toString();
  }

  /* ------------------- Modal handling ------------------- */
  onAddNewCategory(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryItemsCategoriesModalComponent, {
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
        category: null,
        existingCategories: this.allCategories
      }
    });

    dialogRef.afterClosed().subscribe(
      (newCategory: InventoryCategory | undefined) => {
        if (newCategory) {
          if (!newCategory.id) {
            newCategory.id = this.generateId();
          }
          this.allCategories.push(newCategory);
          this.applyAllFilters();
          console.log('New Category Created:', newCategory);
        }
      }
    );
  }

  onEditCategory(category: InventoryCategory): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryItemsCategoriesModalComponent, {
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
        category: { ...category },
        existingCategories: this.allCategories
      }
    });

    dialogRef.afterClosed().subscribe(
      (updated: InventoryCategory | undefined) => {
        if (updated) {
          const idx = this.allCategories.findIndex(
            c => c.id === category.id
          );
          if (idx > -1) {
            this.allCategories[idx] = { ...updated };
            this.applyAllFilters();
          }
        }
      }
    );
  }

  onDeleteCategory(category: InventoryCategory): void {
    if (confirm(`Delete category "${category.name}"?`)) {
      this.allCategories = this.allCategories.filter(
        c => c.id !== category.id
      );
      this.applyAllFilters();
    }
  }
}