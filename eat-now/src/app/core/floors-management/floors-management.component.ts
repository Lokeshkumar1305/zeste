import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FloorsManagementModalComponent } from '../floors-management-modal/floors-management-modal.component';

export interface Floor {
  floorNo: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-floors-management',
  templateUrl: './floors-management.component.html',
  styleUrl: './floors-management.component.scss'
})
export class FloorsManagementComponent implements OnInit {

  /* ---------- Toolbar & Pagination ---------- */
  public selectedStatusFilter: 'All' | 'Active' | 'Inactive' = 'All';

  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  /* ---------- Data ---------- */
  private allFloors: Floor[] = [];
  public filteredFloors: Floor[] = [];
  public pagedFloors: Floor[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    /* Seed sample floors – you can replace with a real API call */
    this.allFloors = [
      { floorNo: 'F-01', description: 'Ground floor – lobby & reception', status: 'Active' },
      { floorNo: 'F-02', description: 'First floor – meeting rooms', status: 'Active' },
      { floorNo: 'F-03', description: 'Second floor – offices', status: 'Inactive' },
      { floorNo: 'F-04', description: 'Third floor – cafeteria', status: 'Active' },
      { floorNo: 'F-05', description: 'Basement parking', status: 'Active' },
      { floorNo: 'F-06', description: 'Rooftop terrace', status: 'Inactive' },
      { floorNo: 'F-07', description: 'Utility floor', status: 'Active' },
      { floorNo: 'F-08', description: 'Guest suites', status: 'Active' }
    ];

    this.applyAllFilters();
  }

  /* ---------- Pagination getters ---------- */
  get totalItems(): number { return this.filteredFloors.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get showingFrom(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get showingTo(): number { return Math.min(this.currentPage * this.pageSize, this.totalItems); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  /* ---------- UI Actions ---------- */
  onSelectStatusChange(value: 'All' | 'Active' | 'Inactive'): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: Array<'All' | 'Active' | 'Inactive'> = ['All', 'Active', 'Inactive'];
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
    this.updatePagedFloors();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedFloors();
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.updatePagedFloors(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagedFloors(); }
  }

  trackByFloorNo(_: number, floor: Floor): string {
    return floor.floorNo;
  }

  /* ---------- Core filtering + pagination ---------- */
  private applyAllFilters(): void {
    this.filteredFloors = this.applyStatusFilter(this.allFloors, this.selectedStatusFilter);
    this.updatePagedFloors();
  }

  private applyStatusFilter(list: Floor[], selected: 'All' | 'Active' | 'Inactive'): Floor[] {
    if (selected === 'All') return [...list];
    return list.filter(f => f.status === selected);
  }

  private updatePagedFloors(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedFloors = this.filteredFloors.slice(start, end);
  }

  /* ---------- Modal handling ---------- */
  onAddNewFloor(): void {
    this.openFloorModal();
  }

  openEditModal(floor: Floor): void {
    this.openFloorModal(floor);
  }

  private openFloorModal(floor?: Floor): void {
    const dialogRef = this.dialog.open(FloorsManagementModalComponent, {
      width: '480px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { floor }                     // pass existing floor for edit
    });

    dialogRef.afterClosed().subscribe((result: Floor | undefined) => {
      if (result) {
        // ---- EDIT ----
        if (floor) {
          const idx = this.allFloors.findIndex(f => f.floorNo === floor.floorNo);
          if (idx > -1) {
            this.allFloors[idx] = { ...result, status: this.allFloors[idx].status };
          }
        }
        // ---- CREATE ----
        else {
          this.allFloors.push({ ...result, status: 'Active' });
        }
        this.applyAllFilters();
      }
    });
  }

  deleteFloor(floorNo: string): void {
    if (confirm(`Delete floor ${floorNo}?`)) {
      this.allFloors = this.allFloors.filter(f => f.floorNo !== floorNo);
      this.applyAllFilters();
    }
  }
}