import { Component } from '@angular/core';
import { ExpensesCategoryModalComponent } from '../expenses-category-modal/expenses-category-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceCategoryModalComponent } from '../maintenance-category-modal/maintenance-category-modal.component';
import { MaintenanceCategory } from '../maintenance-category/maintenance-category.component';

@Component({
  selector: 'app-expenses-category',
  templateUrl: './expenses-category.component.html',
  styleUrl: './expenses-category.component.scss'
})
export class ExpensesCategoryComponent {

  // ───────────────────────────────────── FILTERS ─────────────────────────────────────
  public selectedStatusFilter: 'All' | 'Open' | 'Closed' = 'All';

  // ─────────────────────────────────── PAGINATION ───────────────────────────────────
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // ───────────────────────────────────── DATA ─────────────────────────────────────
  private allCategories: MaintenanceCategory[] = [];
  public filteredCategories: MaintenanceCategory[] = [];
  public pagedCategories: MaintenanceCategory[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample data
    this.allCategories = [
      { id: this.generateId(), name: 'Air Conditioning', description: 'Maintenance and repair of AC units', open: true },
      { id: this.generateId(), name: 'Plumbing', description: 'Fixing leaks, pipes, and drainage issues', open: true },
      { id: this.generateId(), name: 'Electrical', description: 'Wiring, outlets, and lighting repairs', open: false },
      { id: this.generateId(), name: 'Pest Control', description: 'Regular inspection and treatment', open: true },
      { id: this.generateId(), name: 'Elevator Maintenance', description: 'Monthly servicing and safety checks', open: true },
      { id: this.generateId(), name: 'Roofing', description: 'Inspection and repair of roof leaks', open: false }
    ];

    this.applyAllFilters();
  }

  // ──────────────────────────────── PAGINATION GETTERS ───────────────────────────────
  get totalItems(): number { return this.filteredCategories.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get showingFrom(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get showingTo(): number { return Math.min(this.currentPage * this.pageSize, this.totalItems); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  // ──────────────────────────────── FILTER / UI ACTIONS ─────────────────────────────
  onStatusFilterChange(value: 'All' | 'Open' | 'Closed'): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: Array<'All' | 'Open' | 'Closed'> = ['All', 'Open', 'Closed'];
    const idx = order.indexOf(this.selectedStatusFilter);
    this.onStatusFilterChange(order[(idx + 1) % order.length]);
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

  prevPage(): void { if (this.currentPage > 1) { this.currentPage--; this.updatePagedCategories(); } }
  nextPage(): void { if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagedCategories(); } }

  trackById(_: number, item: MaintenanceCategory): string { return item.id; }

  // ──────────────────────────────── CORE LOGIC ───────────────────────────────
  private applyAllFilters(): void {
    this.filteredCategories = this.applyStatusFilter(this.allCategories, this.selectedStatusFilter);
    this.updatePagedCategories();
  }

  private applyStatusFilter(
    list: MaintenanceCategory[],
    selected: 'All' | 'Open' | 'Closed'
  ): MaintenanceCategory[] {
    if (selected === 'All') return [...list];
    return list.filter(c => (selected === 'Open') === c.open);
  }

  private updatePagedCategories(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCategories = this.filteredCategories.slice(start, end);
  }

  // ─────────────────────────────────── CRUD ───────────────────────────────────
  onAddNewMaintenance(): void {
    const dialogRef = this.dialog.open(ExpensesCategoryModalComponent, {
       width: '720px',
     maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.categories?.length) {
        const newCats: MaintenanceCategory[] = result.categories.map((c: any) => ({
          id: this.generateId(),
          name: c.name,
          description: c.description ?? '',
          open: true
        }));
        this.allCategories.push(...newCats);
        this.applyAllFilters();
      }
    });
  }

  onEditCategory(category: MaintenanceCategory): void {
    const dialogRef = this.dialog.open(MaintenanceCategoryModalComponent, {
     width: '720px',
     maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { mode: 'edit', category: { ...category } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.categories?.length) {
        const upd = result.categories[0];
        const idx = this.allCategories.findIndex(c => c.id === category.id);
        if (idx > -1) {
          this.allCategories[idx] = {
            ...this.allCategories[idx],
            name: upd.name,
            description: upd.description ?? ''
          };
          this.applyAllFilters();
        }
      }
    });
  }

  onDeleteCategory(category: MaintenanceCategory): void {
    if (confirm(`Delete "${category.name}"?`)) {
      this.allCategories = this.allCategories.filter(c => c.id !== category.id);
      this.applyAllFilters();
    }
  }

  // ─────────────────────────────────── UTILS ───────────────────────────────────
  private generateId(): string {
    return 'CAT' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
}
