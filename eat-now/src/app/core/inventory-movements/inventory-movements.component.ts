import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventoryMovementsModalComponent } from '../inventory-movements-modal/inventory-movements-modal.component';
import {
  InventoryItem,
  Movement,
  InventoryService
} from '../../shared/services/inventory.service';

export type MovementFilter = 'All' | 'IN' | 'OUT';

@Component({
  selector: 'app-inventory-movements',
  templateUrl: './inventory-movements.component.html',
  styleUrl: './inventory-movements.component.scss'
})
export class InventoryMovementsComponent implements OnInit {
  // Filter by movement type
  public selectedTypeFilter: MovementFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Lookups
  public items: InventoryItem[] = [];

  // Data
  private allMovements: Movement[] = [];
  public filteredMovements: Movement[] = [];
  public pagedMovements: Movement[] = [];

  constructor(
    private dialog: MatDialog,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    // Subscribe to items (for item name / unit in list)
    this.inventoryService.items$.subscribe(items => {
      this.items = items;
    });

    // Subscribe to movements
    this.inventoryService.movements$.subscribe(movements => {
      this.allMovements = movements;
      this.applyAllFilters();
    });
  }

  /* ------------------- Pagination getters ------------------- */
  get totalItems(): number {
    return this.filteredMovements.length;
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
  onSelectTypeChange(value: MovementFilter): void {
    this.selectedTypeFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: MovementFilter[] = ['All', 'IN', 'OUT'];
    const idx = order.indexOf(this.selectedTypeFilter);
    this.onSelectTypeChange(order[(idx + 1) % order.length]);
  }

  onReset(): void {
    this.selectedTypeFilter = 'All';
    this.pageSize = this.pageSizeOptions[0];
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = +size;
    this.currentPage = 1;
    this.updatePagedMovements();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedMovements();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedMovements();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedMovements();
    }
  }

  trackByMovementId(_: number, mv: Movement): string {
    return mv.id;
  }

  /* ------------------- Core filtering + pagination ------------------- */
  private applyAllFilters(): void {
    this.filteredMovements = this.applyTypeFilter(
      this.allMovements,
      this.selectedTypeFilter
    );
    this.updatePagedMovements();
  }

  private applyTypeFilter(
    list: Movement[],
    selected: MovementFilter
  ): Movement[] {
    if (selected === 'All') return [...list];
    return list.filter(m => m.type === selected);
  }

  private updatePagedMovements(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedMovements = this.filteredMovements.slice(start, end);
  }

  /* ------------------- Lookup helpers ------------------- */
  getItemName(itemId?: string): string | undefined {
    if (!itemId) return undefined;
    return this.items.find(i => i.id === itemId)?.name;
  }

  getItemUnitName(itemId?: string): string | undefined {
    if (!itemId) return undefined;
    // Assuming InventoryItem has unitName; adjust if different
    return (this.items.find(i => i.id === itemId) as any)?.unitName;
  }

  /* ------------------- Modal handling ------------------- */
  onAddNewMovement(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryMovementsModalComponent, {
      width,
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: {} as { itemId?: string } // matches modal's data type
    });

    dialogRef.afterClosed().subscribe(result => {
      // Movement is already added in the service inside the modal (addMovement),
      // so we just rely on movements$ subscription to refresh.
      if (result) {
        console.log('Movement recorded:', result);
      }
    });
  }

  onDeleteMovement(mv: Movement): void {
    if (confirm(`Delete movement ${mv.reference || mv.id}?`)) {
      // Assuming InventoryService exposes deleteMovement; implement there if not yet done.
      if (typeof this.inventoryService.deleteMovement === 'function') {
        this.inventoryService.deleteMovement(mv.id);
      } else {
        // Fallback: remove from local list only (does NOT adjust stock)
        this.allMovements = this.allMovements.filter(m => m.id !== mv.id);
        this.applyAllFilters();
      }
    }
  }
}