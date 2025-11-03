import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TenantManagementModalComponent } from '../tenant-management-modal/tenant-management-modal.component';

export interface Tenant {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  roomNumber: string;
  checkinDate: Date;
  status: 'Active' | 'Inactive' | 'Pending';
  monthlyRent: number;
  securityDeposit?: number;
  emergencyContact?: string;
  occupation?: string;
  idProofType?: string;
  idProofFile?: File;
  address?: string;
}

@Component({
  selector: 'app-tenant-management',
  templateUrl: './tenant-management.component.html',
  styleUrl: './tenant-management.component.scss'
})
export class TenantManagementComponent {
  // Data
  private allTenants: Tenant[] = [];
  public filteredTenants: Tenant[] = [];
  public pagedTenants: Tenant[] = [];

  // Filter: Fixed typo — "Inactive Chine" → "Inactive"
  public selectedCaseFilter: 'All' | 'Active' | 'Inactive' | 'Pending' = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.allTenants = [
      {
        id: 'T1',
        fullName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
        roomNumber: '101',
        checkinDate: new Date(2025, 9, 1),
        status: 'Active',
        monthlyRent: 8000
      },
      {
        id: 'T2',
        fullName: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 9876543211',
        roomNumber: '102',
        checkinDate: new Date(2025, 9, 5),
        status: 'Pending',
        monthlyRent: 7500
      },
      {
        id: 'T3',
        fullName: 'Aarav Nair',
        email: 'aarav.nair@email.com',
        phone: '+91 9876543212',
        roomNumber: '103',
        checkinDate: new Date(2025, 9, 10),
        status: 'Active',
        monthlyRent: 8500
      },
      {
        id: 'T4',
        fullName: 'Jaya Reddy',
        email: 'jaya.reddy@email.com',
        phone: '+91 9876543213',
        roomNumber: '104',
        checkinDate: new Date(2025, 9, 12),
        status: 'Inactive',
        monthlyRent: 7000
      },
      {
        id: 'T5',
        fullName: 'Kiran Kumar',
        email: 'kiran.kumar@email.com',
        phone: '+91 9876543214',
        roomNumber: '201',
        checkinDate: new Date(2025, 9, 15),
        status: 'Active',
        monthlyRent: 9000
      },
      {
        id: 'T6',
        fullName: 'Mike Doe',
        email: 'mike.doe@email.com',
        phone: '+91 9876543215',
        roomNumber: '202',
        checkinDate: new Date(2025, 9, 18),
        status: 'Pending',
        monthlyRent: 8200
      }
    ];

    this.applyAllFilters();
  }

  // Pagination Getters
  get totalItems(): number {
    return this.filteredTenants.length;
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

  // Filter & Pagination Logic
  private applyAllFilters(): void {
    this.filteredTenants = this.applyStatusFilter(this.allTenants, this.selectedCaseFilter);
    this.updatePagedTenants();
  }

  private applyStatusFilter(
    list: Tenant[],
    selected: 'All' | 'Active' | 'Inactive' | 'Pending'
  ): Tenant[] {
    if (selected === 'All') return [...list];
    return list.filter(t => t.status === selected);
  }

  private updatePagedTenants(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTenants = this.filteredTenants.slice(start, end);
  }

  // UI Actions
  onFilter(): void {
    const order: Array<'All' | 'Active' | 'Inactive' | 'Pending'> = ['All', 'Active', 'Inactive', 'Pending'];
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
    this.updatePagedTenants();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedTenants();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedTenants();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedTenants();
    }
  }

  trackByTenantId(_: number, item: Tenant): string {
    return item.id ?? item.roomNumber;
  }

  // Tenant Actions
  onAddNewTenant(): void {
    const dialogRef = this.dialog.open(TenantManagementModalComponent, {
      width: '480px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { tenant: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTenant: Tenant = {
          ...result,
          id: 'T' + (this.allTenants.length + 1).toString().padStart(3, '0')
        };
        this.allTenants.push(newTenant);
        this.applyAllFilters();
      }
    });
  }

  onEditTenant(tenant: Tenant): void {
    const dialogRef = this.dialog.open(TenantManagementModalComponent, {
      width: '480px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      data: { tenant }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const idx = this.allTenants.findIndex(t => t.id === result.id);
        if (idx > -1) {
          this.allTenants[idx] = result;
          this.applyAllFilters();
        }
      }
    });
  }

  onDeleteTenant(tenant: Tenant): void {
    if (confirm(`Are you sure you want to delete tenant "${tenant.fullName}"?`)) {
      this.allTenants = this.allTenants.filter(t => t.id !== tenant.id);
      this.applyAllFilters();
    }
  }
}