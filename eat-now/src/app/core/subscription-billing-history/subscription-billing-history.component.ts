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
  paymentProvider?: string; // Razorpay, Stripe, etc.
  last4?: string;           // last 4 digits for card/UPI
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

  /** Derived amounts for summary cards (no arrow functions in template) */
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