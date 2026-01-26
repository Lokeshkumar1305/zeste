import { Component } from '@angular/core';

type BillingStatus = 'paid' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cash';

interface BillingRecord {
  id: number;
  invoiceNumber: string;
  date: Date;
  planName: string;
  periodFrom: Date;
  periodTo: Date;
  amount: number;
  currency: 'INR';
  status: BillingStatus;
  paymentMethod: PaymentMethod;
  paymentProvider?: string;
  last4?: string;
  autoRenew: boolean;
  invoiceUrl?: string;
  downloadUrl?: string;
}

@Component({
  selector: 'app-subscription-billing-history',
  templateUrl: './subscription-billing-history.component.html',
  styleUrls: ['./subscription-billing-history.component.scss'],
})
export class SubscriptionBillingHistoryComponent {
  searchTerm = '';
  statusFilter: BillingStatus | 'all' = 'all';
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50, 100];

  records: BillingRecord[] = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-0001',
      date: new Date(2024, 3, 5),
      planName: 'Ultimate Access',
      periodFrom: new Date(2024, 3, 5),
      periodTo: new Date(2024, 4, 4),
      amount: 2499,
      currency: 'INR',
      status: 'paid',
      paymentMethod: 'card',
      paymentProvider: 'Razorpay',
      last4: '1234',
      autoRenew: true,
      invoiceUrl: '#',
      downloadUrl: '#',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-0002',
      date: new Date(2024, 2, 5),
      planName: 'Growth',
      periodFrom: new Date(2024, 2, 5),
      periodTo: new Date(2024, 3, 4),
      amount: 999,
      currency: 'INR',
      status: 'paid',
      paymentMethod: 'upi',
      paymentProvider: 'PhonePe',
      autoRenew: false,
      invoiceUrl: '#',
      downloadUrl: '#',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-0003',
      date: new Date(2024, 1, 5),
      planName: 'Growth',
      periodFrom: new Date(2024, 1, 5),
      periodTo: new Date(2024, 2, 4),
      amount: 999,
      currency: 'INR',
      status: 'refunded',
      paymentMethod: 'card',
      paymentProvider: 'Razorpay',
      last4: '5678',
      autoRenew: false,
      invoiceUrl: '#',
      downloadUrl: '#',
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-0004',
      date: new Date(2024, 4, 5),
      planName: 'Growth',
      periodFrom: new Date(2024, 4, 5),
      periodTo: new Date(2024, 5, 4),
      amount: 999,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'upi',
      paymentProvider: 'GPay',
      autoRenew: true,
      invoiceUrl: '#',
      downloadUrl: '#',
    },
  ];

  // ✅ ADD THIS METHOD
  trackByRecordId(index: number, record: BillingRecord): number {
    return record.id;
  }

  /** Get current plan name */
  get currentPlanName(): string {
    return this.records.length > 0 ? this.records[0].planName : 'No Plan';
  }

  /** Get renewal date safely */
  get renewalDate(): Date | null {
    return this.records.length > 0 ? this.records[0].periodTo : null;
  }

  /** Get first record safely */
  get firstRecord(): BillingRecord | null {
    return this.records.length > 0 ? this.records[0] : null;
  }

  /** Derived amounts for summary cards */
  get totalPaidAmount(): number {
    return this.records
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  get totalOutstandingAmount(): number {
    return this.records
      .filter((r) => r.status === 'pending' || r.status === 'failed')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  get filteredRecords(): BillingRecord[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.records.filter((r) => {
      const matchesSearch =
        !term ||
        r.invoiceNumber.toLowerCase().includes(term) ||
        r.planName.toLowerCase().includes(term);
      const matchesStatus =
        this.statusFilter === 'all' || r.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get paginatedRecords(): BillingRecord[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRecords.slice(start, start + this.pageSize);
  }

  onPageChange(index: number): void {
    this.pageIndex = index;
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.pageIndex = 0;
  }

  getPageNumbers(): number[] {
    const total = this.filteredRecords.length;
    const pages = Math.ceil(total / this.pageSize);
    return Array.from({ length: pages }, (_, i) => i);
  }

  get totalRecords(): number {
    return this.filteredRecords.length;
  }

  get startIndex(): number {
    return this.pageIndex * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  getStatusLabel(status: BillingStatus): string {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
    }
  }

  getStatusIcon(status: BillingStatus): string {
    switch (status) {
      case 'paid':
        return 'bi-check-circle-fill';
      case 'pending':
        return 'bi-hourglass-split';
      case 'failed':
        return 'bi-x-circle-fill';
      case 'refunded':
        return 'bi-arrow-counterclockwise';
    }
  }

  getPaymentLabel(record: BillingRecord): string {
    const tail = record.last4 ? `•••• ${record.last4}` : '';
    switch (record.paymentMethod) {
      case 'card':
        return `${record.paymentProvider || 'Card'} ${tail}`.trim();
      case 'upi':
        return `${record.paymentProvider || 'UPI'} ${tail}`.trim();
      case 'netbanking':
        return `${record.paymentProvider || 'Netbanking'}`;
      case 'cash':
        return 'Cash';
    }
  }

  viewInvoice(record: BillingRecord): void {
    console.log('View invoice', record.invoiceNumber);
    if (record.invoiceUrl && record.invoiceUrl !== '#') {
      window.open(record.invoiceUrl, '_blank');
    }
  }

  downloadInvoice(record: BillingRecord): void {
    console.log('Download invoice', record.invoiceNumber);
    if (record.downloadUrl && record.downloadUrl !== '#') {
      window.open(record.downloadUrl, '_blank');
    }
  }
}