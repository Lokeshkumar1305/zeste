import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoomTypeManagementModalComponent } from '../room-type-management-modal/room-type-management-modal.component';

export interface RoomType {
  roomType: string;
  beds: string;
  description: string;
}

@Component({
  selector: 'app-room-type-management',
  templateUrl: './room-type-management.component.html',
  styleUrl: './room-type-management.component.scss'
})
export class RoomTypeManagementComponent implements OnInit {

  // Toolbar filters
  public selectedCaseFilter: 'All' | 'Active' | 'Inactive' = 'All'; // placeholder

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allRoomTypes: RoomType[] = [];
  public filteredRoomTypes: RoomType[] = [];
  public pagedRoomTypes: RoomType[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample Room Type data
    this.allRoomTypes = [
      {
        roomType: 'Deluxe Suite',
        beds: '2',
        description: 'Spacious suite with king bed and private balcony.'
      },
      {
        roomType: 'Standard Single',
        beds: '1',
        description: 'Compact room ideal for solo travelers.'
      },
      {
        roomType: 'Family Room',
        beds: '4',
        description: 'Two double beds, suitable for families.'
      },
      {
        roomType: 'Executive Twin',
        beds: '2',
        description: 'Twin beds with work desk and city view.'
      },
      {
        roomType: 'Premium Suite',
        beds: '3',
        description: 'Luxury suite with living area and jacuzzi.'
      }
    ];

    this.applyAllFilters();
  }

  // --- Pagination Getters ---
  get totalItems(): number {
    return this.filteredRoomTypes.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get showingFrom(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // --- UI Actions ---
  onFilter(): void {
    // Placeholder: cycle filter
    const order: Array<'All' | 'Active' | 'Inactive'> = ['All', 'Active', 'Inactive'];
    const idx = order.indexOf(this.selectedCaseFilter);
    this.selectedCaseFilter = order[(idx + 1) % order.length];
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onReset(): void {
    this.selectedCaseFilter = 'All';
    this.pageSize = this.pageSizeOptions[0];
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = +size;
    this.currentPage = 1;
    this.updatePagedRoomTypes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedRoomTypes();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedRoomTypes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedRoomTypes();
    }
  }

  trackByRoomType(_: number, item: RoomType): string {
    return item.roomType;
  }

  // --- CRUD Operations ---
  onAddNewRoom(): void {
    const dialogRef = this.dialog.open(RoomTypeManagementModalComponent, {
      width: '480px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.allRoomTypes.push({ ...result });
        this.applyAllFilters();
      }
    });
  }

  onEdit(room: RoomType): void {
    const dialogRef = this.dialog.open(RoomTypeManagementModalComponent, {
      width: '480px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { room: { ...room } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.allRoomTypes.findIndex(r => r.roomType === room.roomType);
        if (index !== -1) {
          this.allRoomTypes[index] = { ...result };
          this.applyAllFilters();
        }
      }
    });
  }

  onDelete(room: RoomType): void {
    if (confirm(`Are you sure you want to delete room type "${room.roomType}"?`)) {
      this.allRoomTypes = this.allRoomTypes.filter(r => r.roomType !== room.roomType);
      this.applyAllFilters();
    }
  }

  // --- Core filtering + pagination ---
  private applyAllFilters(): void {
    // Currently only supports status-like filter; can be extended
    this.filteredRoomTypes = [...this.allRoomTypes];
    this.updatePagedRoomTypes();
  }

  private updatePagedRoomTypes(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRoomTypes = this.filteredRoomTypes.slice(start, end);
  }
}