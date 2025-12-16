import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentManagementModalComponent } from '../payment-management-modal/payment-management-modal.component';

export interface PaymentItem {
  id?: string;               // optional internal id (auto-generated)
  tenantName: string;
  roomNumber: string;
  amount: number;
  paymentType: string;
  dueDate: Date | string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Waived';
  paymentMethod: string;
  notes?: string;
}

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss']
})
export class PaymentManagementComponent {
  // Toolbar filters
  public selectedStatusFilter: 'All' | 'Pending' | 'Paid' | 'Overdue' | 'Waived' = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allPayments: PaymentItem[] = [];
  public filteredPayments: PaymentItem[] = [];
  public pagedPayments: PaymentItem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Sample data – matches the fields from the modal
    this.allPayments = [
      {
        id: 'PAY001',
        tenantName: 'John Doe',
        roomNumber: '101',
        amount: 8000,
        paymentType: 'Rent',
        dueDate: new Date(2025, 10, 1),   // Nov 1, 2025
        status: 'Pending',
        paymentMethod: '',
        notes: ''
      },
      {
        id: 'PAY002',
        tenantName: 'Jane Smith',
        roomNumber: '102',
        amount: 7500,
        paymentType: 'Rent',
        dueDate: new Date(2025, 10, 5),
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
        notes: ''
      },
      {
        id: 'PAY003',
        tenantName: 'Ramya Kichagari',
        roomNumber: '103',
        amount: 8200,
        paymentType: 'Deposit',
        dueDate: new Date(2025, 9, 28),
        status: 'Overdue',
        paymentMethod: '',
        notes: 'Late notice sent'
      },
      {
        id: 'PAY004',
        tenantName: 'Aarav Nair',
        roomNumber: '104',
        amount: 500,
        paymentType: 'Utility',
        dueDate: new Date(2025, 10, 10),
        status: 'Pending',
        paymentMethod: '',
        notes: ''
      },
      {
        id: 'PAY005',
        tenantName: 'Jaya Reddy',
        roomNumber: '105',
        amount: 2000,
        paymentType: 'Maintenance',
        dueDate: new Date(2025, 10, 15),
        status: 'Paid',
        paymentMethod: 'Credit Card',
        notes: ''
      },
      {
        id: 'PAY006',
        tenantName: 'Kiran Kumar',
        roomNumber: '201',
        amount: 8000,
        paymentType: 'Rent',
        dueDate: new Date(2025, 10, 1),
        status: 'Waived',
        paymentMethod: '',
        notes: 'Waived due to renovation'
      },
      {
        id: 'PAY007',
        tenantName: 'Mike Doe',
        roomNumber: '202',
        amount: 7800,
        paymentType: 'Rent',
        dueDate: new Date(2025, 10, 3),
        status: 'Pending',
        paymentMethod: '',
        notes: ''
      },
      {
        id: 'PAY008',
        tenantName: 'Priya Sharma',
        roomNumber: '203',
        amount: 600,
        paymentType: 'Utility',
        dueDate: new Date(2025, 10, 12),
        status: 'Paid',
        paymentMethod: 'Online Payment',
        notes: ''
      }
    ];

    this.applyAllFilters();
  }

  /* ------------------- Pagination Getters ------------------- */
  get totalItems(): number { return this.filteredPayments.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get showingFrom(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get showingTo(): number { return Math.min(this.currentPage * this.pageSize, this.totalItems); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  /* ------------------- UI Actions ------------------- */
  onSelectStatusChange(value: 'All' | 'Pending' | 'Paid' | 'Overdue' | 'Waived'): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: Array<'All' | 'Pending' | 'Paid' | 'Overdue' | 'Waived'> =
      ['All', 'Pending', 'Paid', 'Overdue', 'Waived'];
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
    this.updatePagedPayments();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedPayments();
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.updatePagedPayments(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagedPayments(); }
  }

  trackById(_: number, item: PaymentItem): string {
    return item.id!;
  }

  /* ------------------- Core Logic ------------------- */
  private applyAllFilters(): void {
    this.filteredPayments = this.applyStatusFilter(this.allPayments, this.selectedStatusFilter);
    this.updatePagedPayments();
  }

  private applyStatusFilter(list: PaymentItem[], selected: typeof this.selectedStatusFilter): PaymentItem[] {
    if (selected === 'All') return [...list];
    return list.filter(p => p.status === selected);
  }

  private updatePagedPayments(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedPayments = this.filteredPayments.slice(start, end);
  }

  /* ------------------- Modal Interactions ------------------- */
  onAddNewPayment(): void {
    const dialogRef = this.dialog.open(PaymentManagementModalComponent, {
      width: '720px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: {}   // empty for "create"
    });

    dialogRef.afterClosed().subscribe((result: PaymentItem) => {
      if (result) {
        // Give it a unique ID
        result.id = 'PAY' + String(this.allPayments.length + 1).padStart(3, '0');
        this.allPayments.unshift(result);
        this.applyAllFilters();
      }
    });
  }

  onEditPayment(payment: PaymentItem): void {
    const dialogRef = this.dialog.open(PaymentManagementModalComponent, {
     width: '720px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      data: { payment: { ...payment } }
    });

    dialogRef.afterClosed().subscribe((updated: PaymentItem) => {
      if (updated) {
        const idx = this.allPayments.findIndex(p => p.id === payment.id);
        if (idx > -1) {
          this.allPayments[idx] = { ...updated, id: payment.id };
          this.applyAllFilters();
        }
      }
    });
  }

  onDeletePayment(payment: PaymentItem): void {
    if (confirm(`Delete payment for ${payment.tenantName} (Room ${payment.roomNumber})?`)) {
      this.allPayments = this.allPayments.filter(p => p.id !== payment.id);
      this.applyAllFilters();
    }
  }
}