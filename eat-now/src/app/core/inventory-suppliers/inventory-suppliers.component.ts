import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventorySuppliersModalComponent } from '../inventory-suppliers-modal/inventory-suppliers-modal.component';

export type SupplierFilter = 'All' | 'Active' | 'Inactive';

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  gst?: string;
  address?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-inventory-suppliers',
  templateUrl: './inventory-suppliers.component.html',
  styleUrl: './inventory-suppliers.component.scss'
})
export class InventorySuppliersComponent implements OnInit {
  // Toolbar filters
  public selectedStatusFilter: SupplierFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allSuppliers: Supplier[] = [];
  public filteredSuppliers: Supplier[] = [];
  public pagedSuppliers: Supplier[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample suppliers
    this.allSuppliers = [
      {
        id: '1',
        name: 'Reliance Fresh',
        contactPerson: 'Mr. Rajesh',
        phone: '9876543210',
        email: 'contact@reliancefresh.com',
        gst: '22AAAAA0000A1Z5',
        address: 'MG Road, Bangalore',
        isActive: true
      },
      {
        id: '2',
        name: 'Big Basket',
        contactPerson: 'Ms. Anjali',
        phone: '9876500000',
        email: 'support@bigbasket.com',
        gst: '29BBBBB1111B2Z6',
        address: 'Online Supplier',
        isActive: true
      },
      {
        id: '3',
        name: 'Local Kirana Store',
        contactPerson: 'Mr. Kumar',
        phone: '9000011111',
        email: '',
        gst: '',
        address: 'Near Hostel Gate',
        isActive: true
      },
      {
        id: '4',
        name: 'Comfort Bedding Co.',
        contactPerson: 'Mr. Sharma',
        phone: '9123456780',
        email: 'sales@comfortbedding.com',
        gst: '27CCCCC2222C3Z7',
        address: 'Industrial Area, Pune',
        isActive: false
      },
      {
        id: '5',
        name: 'Clean & Shine Distributors',
        contactPerson: 'Ms. Pooja',
        phone: '9988776655',
        email: 'info@cleanandshine.com',
        gst: '29DDDDD3333D4Z8',
        address: 'Warehouse Road, Mumbai',
        isActive: true
      },
      {
        id: '6',
        name: 'Online Essentials',
        contactPerson: '',
        phone: '9111222333',
        email: 'orders@onlineessentials.in',
        gst: '',
        address: 'Online Supplier',
        isActive: false
      },
      {
        id: '7',
        name: 'Metro Wholesale',
        contactPerson: 'Mr. Arjun',
        phone: '9000090000',
        email: 'metro@wholesale.com',
        gst: '19EEEEE4444E5Z9',
        address: 'Outer Ring Road, Hyderabad',
        isActive: true
      }
    ];

    this.applyAllFilters();
  }

  /* ------------------- Pagination getters ------------------- */
  get totalItems(): number {
    return this.filteredSuppliers.length;
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
  onSelectStatusChange(value: SupplierFilter): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: SupplierFilter[] = ['All', 'Active', 'Inactive'];
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
    this.updatePagedSuppliers();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedSuppliers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedSuppliers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedSuppliers();
    }
  }

  trackBySupplierId(_: number, supplier: Supplier): string {
    return supplier.id;
  }

  /* ------------------- Core filtering + pagination ------------------- */
  private applyAllFilters(): void {
    this.filteredSuppliers = this.applyStatusFilter(
      this.allSuppliers,
      this.selectedStatusFilter
    );
    this.updatePagedSuppliers();
  }

  private applyStatusFilter(
    list: Supplier[],
    selected: SupplierFilter
  ): Supplier[] {
    if (selected === 'All') return [...list];
    const isActive = selected === 'Active';
    return list.filter(s => s.isActive === isActive);
  }

  private updatePagedSuppliers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSuppliers = this.filteredSuppliers.slice(start, end);
  }

  /* ------------------- Modal handling ------------------- */
  onAddNewSupplier(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventorySuppliersModalComponent, {
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
        supplier: null
      }
    });

    dialogRef.afterClosed().subscribe(
      (newSupplier: Supplier | undefined) => {
        if (newSupplier) {
          if (!newSupplier.id) {
            newSupplier.id = this.generateId();
          }
          this.allSuppliers.push(newSupplier);
          this.applyAllFilters();
          console.log('New Supplier Created:', newSupplier);
        }
      }
    );
  }

  onEditSupplier(supplier: Supplier): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '600px';

    const dialogRef = this.dialog.open(InventorySuppliersModalComponent, {
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
        supplier: { ...supplier }
      }
    });

    dialogRef.afterClosed().subscribe(
      (updated: Supplier | undefined) => {
        if (updated) {
          const idx = this.allSuppliers.findIndex(
            s => s.id === supplier.id
          );
          if (idx > -1) {
            this.allSuppliers[idx] = { ...updated };
            this.applyAllFilters();
          }
        }
      }
    );
  }

  onDeleteSupplier(supplier: Supplier): void {
    if (confirm(`Delete supplier "${supplier.name}"?`)) {
      this.allSuppliers = this.allSuppliers.filter(
        s => s.id !== supplier.id
      );
      this.applyAllFilters();
    }
  }

  /** Simple numeric ID generator */
  private generateId(): string {
    const numericIds = this.allSuppliers
      .map(s => parseInt(s.id, 10))
      .filter(n => !isNaN(n));
    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return next.toString();
  }
}