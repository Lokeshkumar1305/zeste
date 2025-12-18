import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventoryUnitsPopupComponent } from '../inventory-units-popup/inventory-units-popup.component';

export type UnitStatusFilter = 'All' | 'Active' | 'Inactive';

export interface InventoryUnit {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-inventory-units',
  templateUrl: './inventory-units.component.html',
  styleUrl: './inventory-units.component.scss'
})
export class InventoryUnitsComponent implements OnInit {
  // Toolbar filter
  public selectedStatusFilter: UnitStatusFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allUnits: InventoryUnit[] = [];
  public filteredUnits: InventoryUnit[] = [];
  public pagedUnits: InventoryUnit[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample unit data
    this.allUnits = [
      {
        id: '1',
        name: 'Kilograms',
        shortName: 'kg',
        description: 'Standard weight unit',
        isActive: true
      },
      {
        id: '2',
        name: 'Grams',
        shortName: 'g',
        description: 'Smaller weight unit',
        isActive: true
      },
      {
        id: '3',
        name: 'Pieces',
        shortName: 'pcs',
        description: 'Countable items',
        isActive: true
      },
      {
        id: '4',
        name: 'Liters',
        shortName: 'L',
        description: 'Liquid volume',
        isActive: true
      },
      {
        id: '5',
        name: 'Meters',
        shortName: 'm',
        description: 'Length measurement',
        isActive: false
      },
      {
        id: '6',
        name: 'Boxes',
        shortName: 'box',
        description: 'Box-based packaging',
        isActive: true
      },
      {
        id: '7',
        name: 'Packs',
        shortName: 'pack',
        description: 'Packaged units',
        isActive: false
      }
    ];

    this.applyAllFilters();
  }

  /* ------------------- Pagination getters ------------------- */
  get totalItems(): number {
    return this.filteredUnits.length;
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
  onSelectStatusChange(value: UnitStatusFilter): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: UnitStatusFilter[] = ['All', 'Active', 'Inactive'];
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
    this.updatePagedUnits();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedUnits();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUnits();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUnits();
    }
  }

  trackByUnitId(_: number, unit: InventoryUnit): string {
    return unit.id;
  }

  /* ------------------- Core filtering + pagination ------------------- */
  private applyAllFilters(): void {
    this.filteredUnits = this.applyStatusFilter(
      this.allUnits,
      this.selectedStatusFilter
    );
    this.updatePagedUnits();
  }

  private applyStatusFilter(
    list: InventoryUnit[],
    selected: UnitStatusFilter
  ): InventoryUnit[] {
    if (selected === 'All') return [...list];
    const isActive = selected === 'Active';
    return list.filter(u => u.isActive === isActive);
  }

  private updatePagedUnits(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUnits = this.filteredUnits.slice(start, end);
  }

  /* ------------------- Modal handling ------------------- */
  onAddNewUnit(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryUnitsPopupComponent, {
      width: width,
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: null // or { unit: null } depending on your popup TS
    });

    dialogRef.afterClosed().subscribe(
      (newUnit: InventoryUnit | undefined) => {
        if (newUnit) {
          if (!newUnit.id) {
            newUnit.id = this.generateId();
          }
          this.allUnits.push(newUnit);
          this.applyAllFilters();
          console.log('New Unit Created:', newUnit);
        }
      }
    );
  }

  onEditUnit(unit: InventoryUnit): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventoryUnitsPopupComponent, {
      width: width,
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { unit: { ...unit } }
    });

    dialogRef.afterClosed().subscribe(
      (updated: InventoryUnit | undefined) => {
        if (updated) {
          const idx = this.allUnits.findIndex(u => u.id === unit.id);
          if (idx > -1) {
            this.allUnits[idx] = { ...updated };
            this.applyAllFilters();
          }
        }
      }
    );
  }

  onDeleteUnit(unit: InventoryUnit): void {
    if (confirm(`Delete unit "${unit.name}" (${unit.shortName})?`)) {
      this.allUnits = this.allUnits.filter(u => u.id !== unit.id);
      this.applyAllFilters();
    }
  }

  /** Simple ID generator based on existing numeric IDs */
  private generateId(): string {
    const numericIds = this.allUnits
      .map(u => parseInt(u.id, 10))
      .filter(n => !isNaN(n));
    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return next.toString();
  }
}