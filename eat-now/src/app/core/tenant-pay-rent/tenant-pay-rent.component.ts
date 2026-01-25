import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tenant-pay-rent',
    templateUrl: './tenant-pay-rent.component.html',
    styleUrls: ['./tenant-pay-rent.component.scss']
})
export class TenantPayRentComponent implements OnInit {
    rentDetails = {
        amount: 15000,
        dueDate: new Date(2026, 1, 5), // Feb 5, 2026
        status: 'Pending',
        month: 'February 2026',
        lateFee: 0,
        electricity: 1250,
        maintenance: 500,
        total: 16750
    };

    paymentMethods = [
        { id: 'upi', name: 'UPI', icon: 'bi-qr-code-scan', color: '#673ab7' },
        { id: 'card', name: 'Credit/Debit Card', icon: 'bi-credit-card', color: '#00bcd4' },
        { id: 'netbanking', name: 'Net Banking', icon: 'bi-bank', color: '#ff9800' }
    ];

    selectedMethod = 'upi';
    isProcessing = false;
    paymentSuccess = false;
    today = new Date();

    constructor() { }

    ngOnInit(): void {
    }

    onPayNow() {
        this.isProcessing = true;
        // Simulate payment processing
        setTimeout(() => {
            this.isProcessing = false;
            this.paymentSuccess = true;
        }, 2000);
    }

    closeReceipt() {
        this.paymentSuccess = false;
    }
}
