import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesManagementModalComponent } from '../expenses-management-modal/expenses-management-modal.component';
import { CaseItem } from '../room-management/room-management.component';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';

@Component({
  selector: 'app-amenities-management',
  templateUrl: './amenities-management.component.html',
  styleUrl: './amenities-management.component.scss'
})
export class AmenitiesManagementComponent {
// Toolbar filters
  public selectedCaseFilter: 'All' | 'Open' | 'Closed' | 'On Hold' = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allCases: CaseItem[] = [];
  public filteredCases: CaseItem[] = [];
  public pagedCases: CaseItem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample data (replicates look from screenshot)
    this.allCases = [
      {
        id: 'DIS296190110587',
        type: 'Dispute',
        subtype: 'MC',
        status: 'Open',
        priority: 'Medium',
        owner: 'ramya kichagari kichagari',
        date: new Date(2025, 9, 24) // Oct 24, 2025
      },
      {
        id: 'DIS296190110537',
        type: 'Dispute',
        subtype: 'MC',
        status: 'Open',
        priority: 'Medium',
        owner: 'ramya kichagari kichagari',
        date: new Date(2025, 9, 24)
      },
      // extra rows to demonstrate pagination
      {
        id: 'DIS296190110530',
        type: 'Dispute',
        subtype: 'MC',
        status: 'Closed',
        priority: 'Low',
        owner: 'aarav nair',
        date: new Date(2025, 9, 22)
      },
      {
        id: 'DIS296190110531',
        type: 'Dispute',
        subtype: 'MC',
        status: 'On Hold',
        priority: 'High',
        owner: 'jaya reddy',
        date: new Date(2025, 9, 21)
      },
      {
        id: 'DIS296190110532',
        type: 'Dispute',
        subtype: 'MC',
        status: 'Open',
        priority: 'High',
        owner: 'kiran kumar',
        date: new Date(2025, 9, 20)
      },
      {
        id: 'DIS296190110533',
        type: 'Chargeback',
        subtype: 'VISA',
        status: 'Closed',
        priority: 'Medium',
        owner: 'mike doe',
        date: new Date(2025, 9, 19)
      },
      {
        id: 'DIS296190110534',
        type: 'Dispute',
        subtype: 'MC',
        status: 'Open',
        priority: 'Low',
        owner: 'priya sharma',
        date: new Date(2025, 9, 18)
      },
      {
        id: 'DIS296190110535',
        type: 'Chargeback',
        subtype: 'AMEX',
        status: 'On Hold',
        priority: 'Medium',
        owner: 'sara lee',
        date: new Date(2025, 9, 17)
      }
    ];

    this.applyAllFilters();
  }

  // Derived getters for "Showing X to Y of Z entries"
  get totalItems(): number {
    return this.filteredCases.length;
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

  // UI Actions
  onSelectCasesChange(value: 'All' | 'Open' | 'Closed' | 'On Hold'): void {
    this.selectedCaseFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    // In a real app, open filter panel or popover here.
    // For now, toggle a sample filter: cycle through status quickly.
    const order: Array<'All' | 'Open' | 'Closed' | 'On Hold'> = ['All', 'Open', 'Closed', 'On Hold'];
    const idx = order.indexOf(this.selectedCaseFilter);
    this.onSelectCasesChange(order[(idx + 1) % order.length]);
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
    this.updatePagedCases();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedCases();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedCases();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedCases();
    }
  }

  trackById(_: number, item: CaseItem): string {
    return item.id;
  }

  // Core filtering + pagination
  private applyAllFilters(): void {
    this.filteredCases = this.applyStatusFilter(this.allCases, this.selectedCaseFilter);
    this.updatePagedCases();
  }

  private applyStatusFilter(list: CaseItem[], selected: 'All' | 'Open' | 'Closed' | 'On Hold'): CaseItem[] {
    if (selected === 'All') return [...list];
    return list.filter(c => c.status === selected);
  }

  private updatePagedCases(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCases = this.filteredCases.slice(start, end);
  }

onAddNewExpenses(): void {
    const dialogRef = this.dialog.open(AmenitiesManagementModalComponent, {
      width: '480px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New Room Created:', result);
        // Handle save logic
      }
    });
  }


  

}





