import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventoryPurchaseOrdersModalComponent } from '../inventory-purchase-orders-modal/inventory-purchase-orders-modal.component';

export type PurchaseOrderStatus =
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Ordered'
  | 'Received'
  | 'Cancelled';

export type PurchaseOrderFilter = 'All' | PurchaseOrderStatus;

export interface Supplier {
  id: string;
  name: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;              // internal id
  orderNumber: string;     // display PO number (e.g. PO-2024-001)
  supplierId: string;
  status: PurchaseOrderStatus;
  orderDate: Date;
  expectedDate: Date;
  items: PurchaseOrderItem[];
  totalAmount: number;
  notes?: string;
}

@Component({
  selector: 'app-inventory-purchase-orders',
  templateUrl: './inventory-purchase-orders.component.html',
  styleUrl: './inventory-purchase-orders.component.scss'
})
export class InventoryPurchaseOrdersComponent implements OnInit {
  // Toolbar filters
  public selectedStatusFilter: PurchaseOrderFilter = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Lookups
  public suppliers: Supplier[] = [];

  // Data
  private allOrders: PurchaseOrder[] = [];
  public filteredOrders: PurchaseOrder[] = [];
  public pagedOrders: PurchaseOrder[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed suppliers
    this.suppliers = [
      { id: 's1', name: 'Fresh Foods Supplier' },
      { id: 's2', name: 'Clean & Shine Distributors' },
      { id: 's3', name: 'Comfort Bedding Co.' }
    ];

    // Seed sample orders
    this.allOrders = [
      {
        id: '1',
        orderNumber: 'PO-2024-001',
        supplierId: 's1',
        status: 'Pending',
        orderDate: new Date('2024-01-05'),
        expectedDate: new Date('2024-01-10'),
        items: [
          {
            itemId: 'i1',
            itemName: 'Basmati Rice',
            quantity: 50,
            unitPrice: 80,
            totalPrice: 4000
          },
          {
            itemId: 'i2',
            itemName: 'Cooking Oil',
            quantity: 30,
            unitPrice: 120,
            totalPrice: 3600
          }
        ],
        totalAmount: 7600,
        notes: 'Monthly food stock'
      },
      {
        id: '2',
        orderNumber: 'PO-2024-002',
        supplierId: 's2',
        status: 'Ordered',
        orderDate: new Date('2024-01-08'),
        expectedDate: new Date('2024-01-12'),
        items: [
          {
            itemId: 'i3',
            itemName: 'Floor Cleaner',
            quantity: 20,
            unitPrice: 150,
            totalPrice: 3000
          }
        ],
        totalAmount: 3000,
        notes: 'Cleaning supplies for January'
      },
      {
        id: '3',
        orderNumber: 'PO-2024-003',
        supplierId: 's3',
        status: 'Received',
        orderDate: new Date('2023-12-20'),
        expectedDate: new Date('2023-12-25'),
        items: [
          {
            itemId: 'i4',
            itemName: 'Bedsheet (Single)',
            quantity: 15,
            unitPrice: 400,
            totalPrice: 6000
          }
        ],
        totalAmount: 6000,
        notes: 'New bedsheets for Block A'
      },
      {
        id: '4',
        orderNumber: 'PO-2024-004',
        supplierId: 's1',
        status: 'Draft',
        orderDate: new Date('2024-01-15'),
        expectedDate: new Date('2024-01-18'),
        items: [],
        totalAmount: 0,
        notes: 'Draft order for next month'
      },
      {
        id: '5',
        orderNumber: 'PO-2024-005',
        supplierId: 's2',
        status: 'Cancelled',
        orderDate: new Date('2023-11-10'),
        expectedDate: new Date('2023-11-15'),
        items: [
          {
            itemId: 'i5',
            itemName: 'Hand Soap',
            quantity: 50,
            unitPrice: 25,
            totalPrice: 1250
          }
        ],
        totalAmount: 1250,
        notes: 'Cancelled due to wrong pricing'
      }
    ];

    this.applyAllFilters();
  }

  /* ------------------- Pagination getters ------------------- */
  get totalItems(): number {
    return this.filteredOrders.length;
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
  onSelectStatusChange(value: PurchaseOrderFilter): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: PurchaseOrderFilter[] = [
      'All',
      'Draft',
      'Pending',
      'Approved',
      'Ordered',
      'Received',
      'Cancelled'
    ];
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
    this.updatePagedOrders();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedOrders();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedOrders();
    }
  }

  trackByOrderId(_: number, order: PurchaseOrder): string {
    return order.id;
  }

  /* ------------------- Core filtering + pagination ------------------- */
  private applyAllFilters(): void {
    this.filteredOrders = this.applyStatusFilter(
      this.allOrders,
      this.selectedStatusFilter
    );
    this.updatePagedOrders();
  }

  private applyStatusFilter(
    list: PurchaseOrder[],
    selected: PurchaseOrderFilter
  ): PurchaseOrder[] {
    if (selected === 'All') return [...list];
    return list.filter(o => o.status === selected);
  }

  private updatePagedOrders(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedOrders = this.filteredOrders.slice(start, end);
  }

  /* ------------------- Helpers ------------------- */
  getSupplierName(supplierId: string): string | undefined {
    return this.suppliers.find(s => s.id === supplierId)?.name;
  }

  /** Simple ID generator based on existing numeric IDs */
  private generateOrderId(): string {
    const numericIds = this.allOrders
      .map(o => parseInt(o.id, 10))
      .filter(n => !isNaN(n));
    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return next.toString();
  }

  private generateOrderNumber(): string {
    const prefix = 'PO-2024-';
    const numbers = this.allOrders
      .map(o => {
        const part = o.orderNumber.split('-').pop() || '';
        const num = parseInt(part, 10);
        return isNaN(num) ? 0 : num;
      })
      .filter(n => n > 0);

    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `${prefix}${next.toString().padStart(3, '0')}`;
  }

  /* ------------------- Modal handling ------------------- */
  onAddNewOrder(): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '800px';

    const dialogRef = this.dialog.open(InventoryPurchaseOrdersModalComponent, {
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
        order: null,
        suppliers: this.suppliers
        // you can also pass availableItems here if your modal expects it
        // availableItems: this.items
      }
    });

    dialogRef.afterClosed().subscribe(
      (newOrder: PurchaseOrder | undefined) => {
        if (newOrder) {
          if (!newOrder.id) {
            newOrder.id = this.generateOrderId();
          }
          if (!newOrder.orderNumber) {
            newOrder.orderNumber = this.generateOrderNumber();
          }
          this.allOrders.push(newOrder);
          this.applyAllFilters();
          console.log('New Purchase Order Created:', newOrder);
        }
      }
    );
  }

  onEditOrder(order: PurchaseOrder): void {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? '100vw' : '800px';

    const dialogRef = this.dialog.open(InventoryPurchaseOrdersModalComponent, {
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
        order: { ...order },
        suppliers: this.suppliers
        // availableItems: this.items
      }
    });

    dialogRef.afterClosed().subscribe(
      (updated: PurchaseOrder | undefined) => {
        if (updated) {
          const idx = this.allOrders.findIndex(o => o.id === order.id);
          if (idx > -1) {
            this.allOrders[idx] = {
              ...this.allOrders[idx],
              ...updated
            };
            this.applyAllFilters();
          }
        }
      }
    );
  }

  onDeleteOrder(order: PurchaseOrder): void {
    if (confirm(`Delete purchase order ${order.orderNumber || order.id}?`)) {
      this.allOrders = this.allOrders.filter(o => o.id !== order.id);
      this.applyAllFilters();
    }
  }
}