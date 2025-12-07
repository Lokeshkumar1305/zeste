import { Component, OnInit, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RoomDetails, RoomManagementModalComponent } from '../../core/room-management-modal/room-management-modal.component';
import { RoleDetailsComponent } from '../role-details/role-details.component';



type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';


type CaseStatus = 'Open' | 'Closed' | 'On Hold';
type CasePriority = 'Low' | 'Medium' | 'High';

export interface CaseItem {
  id: string;
  type: string;
  subtype: string;
  status: CaseStatus;
  priority: CasePriority;
  owner: string;
  date: Date;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  // Toolbar filters
  public selectedStatusFilter: 'All' | RoomStatus = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allRooms: RoomDetails[] = [];
  public filteredRooms: RoomDetails[] = [];
  public pagedRooms: RoomDetails[] = [];

  constructor(
    private dialog: MatDialog,
    public router: Router,
  ) {}

  ngOnInit(): void {
    // Seed sample room data
    this.allRooms = [
      {
        roomNumber: '101',
        type: 'Single',
        monthlyRent: 8000,
        securityDeposit: 16000,
        floor: 'Ground',
        beds: 1,
        status: 'Available',
        description: 'Spacious single room with attached bathroom',
        amenities: ['Wi-Fi', 'AC', 'TV']
      },
      {
        roomNumber: '102',
        type: 'Double',
        monthlyRent: 12000,
        securityDeposit: 24000,
        floor: 'Ground',
        beds: 2,
        status: 'Occupied',
        description: '',
        amenities: ['Wi-Fi', 'AC']
      },
      {
        roomNumber: '201',
        type: 'Single',
        monthlyRent: 8500,
        securityDeposit: 17000,
        floor: 'First',
        beds: 1,
        status: 'Maintenance',
        description: '',
        amenities: ['Wi-Fi', 'TV']
      },
      {
        roomNumber: '202',
        type: 'Double',
        monthlyRent: 13000,
        securityDeposit: 26000,
        floor: 'First',
        beds: 2,
        status: 'Available',
        description: 'Balcony view',
        amenities: ['Wi-Fi', 'AC', 'Balcony']
      },
      {
        roomNumber: '301',
        type: 'Single',
        monthlyRent: 8200,
        securityDeposit: 16400,
        floor: 'Second',
        beds: 1,
        status: 'Occupied',
        description: '',
        amenities: ['Wi-Fi']
      },
      {
        roomNumber: '302',
        type: 'Double',
        monthlyRent: 12500,
        securityDeposit: 25000,
        floor: 'Second',
        beds: 2,
        status: 'Available',
        description: '',
        amenities: ['Wi-Fi', 'AC', 'TV']
      },
      {
        roomNumber: '303',
        type: 'Single',
        monthlyRent: 7900,
        securityDeposit: 15800,
        floor: 'Second',
        beds: 1,
        status: 'Available',
        description: '',
        amenities: ['Wi-Fi']
      }
    ];

    this.applyAllFilters();
  }

  /* -------------------  Pagination getters  ------------------- */
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

  /* -------------------  UI Actions  ------------------- */
  onSelectStatusChange(value: 'All' | RoomStatus): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: Array<'All' | RoomStatus> = ['All', 'Available', 'Occupied', 'Maintenance'];
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
    this.updatePagedRooms();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedRooms();
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

  trackByRoomNumber(_: number, room: RoomDetails): string {
    return room.roomNumber;
  }

  /* -------------------  Core filtering + pagination  ------------------- */
  private applyAllFilters(): void {
    this.filteredRooms = this.applyStatusFilter(this.allRooms, this.selectedStatusFilter);
    this.updatePagedRooms();
  }

  private applyStatusFilter(list: RoomDetails[], selected: 'All' | RoomStatus): RoomDetails[] {
    if (selected === 'All') return [...list];
    return list.filter(r => r.status === selected);
  }

  private updatePagedRooms(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRooms = this.filteredRooms.slice(start, end);
  }

  /* -------------------  Modal handling  ------------------- */
  onAddNewRoom(): void {
  
  this.router.navigate(['/recon-directory']);
  }

  onEditRoom(room: RoomDetails): void {
    const dialogRef = this.dialog.open(RoleDetailsComponent, {
      width: '600px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { room: { ...room }, amenityOptions: this.getAllAmenities() }
    });

    dialogRef.afterClosed().subscribe((updated: RoomDetails | undefined) => {
      if (updated) {
        const idx = this.allRooms.findIndex(r => r.roomNumber === room.roomNumber);
        if (idx > -1) {
          this.allRooms[idx] = updated;
          this.applyAllFilters();
        }
      }
    });
  }

  onDeleteRoom(room: RoomDetails): void {
    if (confirm(`Delete room ${room.roomNumber}?`)) {
      this.allRooms = this.allRooms.filter(r => r.roomNumber !== room.roomNumber);
      this.applyAllFilters();
    }
  }

  /** Helper – collect all unique amenities from existing rooms */
  private getAllAmenities(): string[] {
    const set = new Set<string>();
    this.allRooms.forEach(r => r.amenities.forEach(a => set.add(a)));
    return Array.from(set);
  }
}