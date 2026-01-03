import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';

export interface AmenityGroup {
  id: string;
  name: string;
  items: string[];
  createdAt: Date;
}

export interface Room {
  id: string;
  type: string;
  subtype: string;
  floor: string;
  rent: number;
  amenities: string[];
  status: 'Available' | 'Occupied' | 'Maintenance';
}

@Component({
  selector: 'app-amenities-management',
  templateUrl: './amenities-management.component.html',
  styleUrls: ['./amenities-management.component.scss']
})
export class AmenitiesManagementComponent implements OnInit {
  public amenitiesList: AmenityGroup[] = [];
  public roomsList: Room[] = [];

  public showRoomsTable = true; // Set to false if you want to hide rooms initially

  // Pagination & Filtering for Rooms
  public pageSizeOptions: number[] = [6, 12, 24];
  public pageSize = 6;
  public currentPage = 1;

  private allRooms: Room[] = [];
  public filteredRooms: Room[] = [];
  public pagedRooms: Room[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAmenitiesFromStorage();
    this.loadRoomsFromStorage();
    this.seedSampleRooms(); // Only if no data in storage
  }

  // === Amenities Management ===

  private loadAmenitiesFromStorage(): void {
    const stored = localStorage.getItem('amenitiesList');
    if (stored) {
      this.amenitiesList = JSON.parse(stored);
    } else {
      this.seedDefaultAmenities();
    }
  }

  private seedDefaultAmenities(): void {
    this.amenitiesList = [
      {
        id: this.generateId('AMN'),
        name: 'Premium Package',
        items: ['WiFi', 'AC', 'TV', 'Mini Fridge', 'Room Service', 'Laundry'],
        createdAt: new Date()
      },
      {
        id: this.generateId('AMN'),
        name: 'Standard Package',
        items: ['WiFi', 'Fan', 'Study Desk', 'Cupboard'],
        createdAt: new Date()
      }
    ];
    this.saveAmenitiesToStorage();
  }

  private saveAmenitiesToStorage(): void {
    localStorage.setItem('amenitiesList', JSON.stringify(this.amenitiesList));
  }

  private generateId(prefix: string): string {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  onAddNewAmenity(): void {
    const dialogRef = this.dialog.open(AmenitiesManagementModalComponent, {
    width: '520px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: ['custom-dialog-container', 'full-screen-on-mobile'],
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { amenities: [], title: 'Add New Amenity Group' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name && result.items?.length > 0) {
        const newGroup: AmenityGroup = {
          id: this.generateId('AMN'),
          name: result.name,
          items: result.items,
          createdAt: new Date()
        };
        this.amenitiesList.push(newGroup);
        this.saveAmenitiesToStorage();
      }
    });
  }

  onEditAmenity(amenity: AmenityGroup): void {
    const dialogRef = this.dialog.open(AmenitiesManagementModalComponent, {
       width: '520px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: ['custom-dialog-container', 'full-screen-on-mobile'],
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { amenities: amenity.items, name: amenity.name, title: 'Edit Amenity Group' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.items?.length > 0) {
        const index = this.amenitiesList.findIndex(a => a.id === amenity.id);
        if (index !== -1) {
          this.amenitiesList[index] = {
            ...this.amenitiesList[index],
            name: result.name || this.amenitiesList[index].name,
            items: result.items
          };
          this.saveAmenitiesToStorage();
        }
      }
    });
  }

  onDeleteAmenity(amenityId: string): void {
    if (confirm('Are you sure you want to delete this amenity group?')) {
      this.amenitiesList = this.amenitiesList.filter(a => a.id !== amenityId);
      this.saveAmenitiesToStorage();
    }
  }

  trackByAmenityId(_: number, item: AmenityGroup): string {
    return item.id;
  }

  // === Rooms Management ===

  private loadRoomsFromStorage(): void {
    const stored = localStorage.getItem('roomsList');
    if (stored) {
      this.roomsList = JSON.parse(stored);
      this.allRooms = [...this.roomsList];
      this.applyRoomFilters();
    }
  }

  private saveRoomsToStorage(): void {
    localStorage.setItem('roomsList', JSON.stringify(this.roomsList));
  }

  private seedSampleRooms(): void {
    if (this.roomsList.length > 0) return;

    this.roomsList = [
      {
        id: '101',
        type: 'Single',
        subtype: 'AC',
        floor: '1st Floor',
        rent: 8000,
        amenities: ['WiFi', 'AC', 'TV', 'Study Desk'],
        status: 'Available'
      },
      {
        id: '102',
        type: 'Double',
        subtype: 'Non-AC',
        floor: '1st Floor',
        rent: 12000,
        amenities: ['WiFi', 'Fan', 'Cupboard'],
        status: 'Occupied'
      },
      {
        id: '201',
        type: 'Single',
        subtype: 'AC',
        floor: '2nd Floor',
        rent: 8500,
        amenities: ['WiFi', 'AC', 'Mini Fridge', 'TV'],
        status: 'Maintenance'
      },
      {
        id: '202',
        type: 'Triple',
        subtype: 'AC',
        floor: '2nd Floor',
        rent: 18000,
        amenities: ['WiFi', 'AC', 'TV', 'Room Service'],
        status: 'Available'
      }
    ];

    this.allRooms = [...this.roomsList];
    this.saveRoomsToStorage();
    this.applyRoomFilters();
  }

  // Room CRUD (you'll need a Room modal later)
  onAddNewRoom(): void {
    alert('Add New Room modal not implemented yet. Implement RoomManagementModalComponent.');
    // Open modal here similar to amenities
  }

  onEditRoom(room: Room): void {
    alert(`Edit room ${room.id} - implement modal`);
    // Implement edit modal
  }

  onDeleteRoom(room: Room): void {
    if (confirm(`Are you sure you want to delete Room ${room.id}?`)) {
      this.roomsList = this.roomsList.filter(r => r.id !== room.id);
      this.allRooms = [...this.roomsList];
      this.saveRoomsToStorage();
      this.applyRoomFilters();
    }
  }

  // Pagination & Filtering
  get totalItems(): number {
    return this.filteredRooms.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get showingFrom(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagedRooms();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedRooms();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedRooms();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedRooms();
    }
  }

  trackById(_: number, item: Room): string {
    return item.id;
  }

  private applyRoomFilters(): void {
    this.filteredRooms = [...this.allRooms];
    this.updatePagedRooms();
  }

  private updatePagedRooms(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRooms = this.filteredRooms.slice(start, end);
  }

  // Filter & Reset (you can expand later with status filter)
  onFilter(): void {
    // Cycle or open filter dialog
  }

  onReset(): void {
    this.currentPage = 1;
    this.pageSize = this.pageSizeOptions[0];
    this.applyRoomFilters();
  }
}