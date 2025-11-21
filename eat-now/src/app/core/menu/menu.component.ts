import { Component, ViewChild } from '@angular/core';
import { AreaTableModalComponent } from '../area-table-modal/area-table-modal.component';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';


export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  vendor: string;
  description?: string;
  notes?: string;
  attachment?: string; // URL or base64
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
   // Toolbar filters
    public selectedCategoryFilter: string = 'All';
  
    // Pagination
    public pageSizeOptions: number[] = [5, 10, 25];
    public pageSize = 5;
    public currentPage = 1;
  
    // Data
    private allExpenses: ExpenseItem[] = [];
    public filteredExpenses: ExpenseItem[] = [];
    public pagedExpenses: ExpenseItem[] = [];
  
    // Categories & Payment Methods (for filtering & modal)
    public categories: string[] = ['Utilities', 'Maintenance', 'Supplies', 'Rent', 'Salaries', 'Others'];
    public paymentMethods: string[] = ['Cash', 'Bank Transfer', 'Credit Card', 'UPI', 'Cheque'];
  
    constructor(private dialog: MatDialog) {}
  
    ngOnInit(): void {
      this.allExpenses = [
        {
          id: 'EXP001',
          title: 'Electricity Bill',
          category: 'Utilities',
          amount: 1250.00,
          date: new Date(2025, 9, 15),
          paymentMethod: 'Bank Transfer',
          vendor: 'State Electricity Board',
          description: 'Monthly electricity bill for October',
          notes: 'Paid on time'
        },
        {
          id: 'EXP002',
          title: 'Office Rent',
          category: 'Rent',
          amount: 15000.00,
          date: new Date(2025, 9, 1),
          paymentMethod: 'Cheque',
          vendor: 'ABC Realty',
          description: 'Monthly office rent'
        },
        {
          id: 'EXP003',
          title: 'Printer Paper & Ink',
          category: 'Supplies',
          amount: 850.50,
          date: new Date(2025, 9, 20),
          paymentMethod: 'Credit Card',
          vendor: 'Office Depot',
          notes: 'Bulk purchase'
        },
        {
          id: 'EXP004',
          title: 'Building Maintenance',
          category: 'Maintenance',
          amount: 3200.00,
          date: new Date(2025, 9, 18),
          paymentMethod: 'Cash',
          vendor: 'Local Contractor'
        },
        {
          id: 'EXP005',
          title: 'Internet Bill',
          category: 'Utilities',
          amount: 999.00,
          date: new Date(2025, 9, 10),
          paymentMethod: 'UPI',
          vendor: 'Jio Fiber'
        },
        {
          id: 'EXP006',
          title: 'Staff Salaries',
          category: 'Salaries',
          amount: 45000.00,
          date: new Date(2025, 9, 30),
          paymentMethod: 'Bank Transfer',
          vendor: 'HR Department'
        }
      ];
  
      this.applyAllFilters();
    }
  
    // --- Pagination Getters ---
    get totalItems(): number {
      return this.filteredExpenses.length;
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
  
    // --- UI Actions ---
    onFilter(): void {
      const order = ['All', ...this.categories];
      const idx = order.indexOf(this.selectedCategoryFilter);
      this.selectedCategoryFilter = order[(idx + 1) % order.length];
      this.currentPage = 1;
      this.applyAllFilters();
    }
  
    onReset(): void {
      this.selectedCategoryFilter = 'All';
      this.pageSize = this.pageSizeOptions[0];
      this.currentPage = 1;
      this.applyAllFilters();
    }
  
    onPageSizeChange(size: number): void {
      this.pageSize = +size;
      this.currentPage = 1;
      this.updatePagedExpenses();
    }
  
    goToPage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updatePagedExpenses();
    }
  
    prevPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagedExpenses();
      }
    }
  
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePagedExpenses();
      }
    }
  
    trackById(_: number, item: ExpenseItem): string {
      return item.id;
    }
  
    // --- Core Logic ---
    private applyAllFilters(): void {
      this.filteredExpenses = this.applyCategoryFilter(this.allExpenses, this.selectedCategoryFilter);
      this.updatePagedExpenses();
    }
  
    private applyCategoryFilter(list: ExpenseItem[], filter: string): ExpenseItem[] {
      if (filter === 'All') return [...list];
      return list.filter(e => e.category === filter);
    }
  
    private updatePagedExpenses(): void {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.pagedExpenses = this.filteredExpenses.slice(start, end);
    }
  
    // --- CRUD Actions ---
    onAddNewExpenses(): void {
      const dialogRef = this.dialog.open(MenuModalComponent, {
        width: '560px',
        maxWidth: '90vw',
        height: '100vh',
        position: { right: '0', top: '0' },
        panelClass: 'custom-dialog-container',
        data: { expense: null, categories: this.categories, paymentMethods: this.paymentMethods },
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        disableClose: false,
        autoFocus: false,
      });
  
      dialogRef.afterClosed().subscribe((result: ExpenseItem) => {
        if (result) {
          result.id = 'EXP' + String(this.allExpenses.length + 1).padStart(3, '0');
          this.allExpenses.push(result);
          this.applyAllFilters();
        }
      });
    }
  
    onEditExpense(expense: ExpenseItem): void {
      const dialogRef = this.dialog.open(MenuModalComponent, {
        width: '560px',
        maxWidth: '90vw',
        height: '100vh',
        position: { right: '0', top: '0' },
        panelClass: 'custom-dialog-container',
        data: { expense: { ...expense }, categories: this.categories, paymentMethods: this.paymentMethods },
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
      });
  
      dialogRef.afterClosed().subscribe((result: ExpenseItem) => {
        if (result) {
          const index = this.allExpenses.findIndex(e => e.id === expense.id);
          if (index !== -1) {
            this.allExpenses[index] = result;
            this.applyAllFilters();
          }
        }
      });
    }
  
    onDeleteExpense(id: string): void {
      if (confirm('Are you sure you want to delete this expense?')) {
        this.allExpenses = this.allExpenses.filter(e => e.id !== id);
        this.applyAllFilters();
      }
    }

    
}
