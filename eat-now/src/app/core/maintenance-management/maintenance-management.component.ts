import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceManagementModalComponent } from '../maintenance-management-modal/maintenance-management-modal.component';


export interface MaintenanceIssue {
  tenantName: string;
  roomNumber: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  status:string;
  imageFile?: File;         // Actual file
  imagePreview?: string;    // Base64 for preview
  imageName?: string;       // Original filename
}
@Component({
  selector: 'app-maintenance-management',
  templateUrl: './maintenance-management.component.html',
  styleUrl: './maintenance-management.component.scss'
})
export class MaintenanceManagementComponent {
public selectedCaseFilter: 'All' | 'Open' | 'Closed' | 'On Hold' = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allCases: MaintenanceIssue[] = [];
  public filteredCases: MaintenanceIssue[] = [];
  public pagedCases: MaintenanceIssue[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Seed sample maintenance data
    this.allCases = [
      {
        tenantName: 'Ramya Kichagari',
        roomNumber: '101',
        title: 'AC not cooling properly',
        category: 'Electrical',
        priority: 'High',
        description: 'The AC in room 101 is blowing warm air even after setting to 18°C.',
        status: 'Open',
        imageFile: undefined,
        imagePreview: '',
        imageName: ''
      },
      {
        tenantName: 'Aarav Nair',
        roomNumber: '205',
        title: 'Leaking faucet in bathroom',
        category: 'Plumbing',
        priority: 'Medium',
        description: 'Bathroom sink faucet drips continuously. Water wastage observed.',
        status: 'Open',
        imageFile: undefined,
        imagePreview: '',
        imageName: ''
      },
      {
        tenantName: 'Priya Sharma',
        roomNumber: '308',
        title: 'Broken window latch',
        category: 'Carpentry',
        priority: 'Low',
        description: 'Window in bedroom does not lock properly. Security concern.',
        status: 'On Hold',
        imageFile: undefined,
        imagePreview: '',
        imageName: ''
      },
      {
        tenantName: 'Kiran Kumar',
        roomNumber: '402',
        title: 'WiFi not working',
        category: 'Network',
        priority: 'High',
        description: 'No internet connection in room since yesterday.',
        status: 'Closed',
        imageFile: undefined,
        imagePreview: '',
        imageName: ''
      },
      {
        tenantName: 'Sara Lee',
        roomNumber: '115',
        title: 'Flickering light in hallway',
        category: 'Electrical',
        priority: 'Medium',
        description: 'Hallway light flickers when switched on.',
        status: 'Open',
        imageFile: undefined,
        imagePreview: '',
        imageName: ''
      }
    ];

    this.applyAllFilters();
  }

  // Pagination Getters
  get totalItems(): number { return this.filteredCases.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get showingFrom(): number { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get showingTo(): number { return Math.min(this.currentPage * this.pageSize, this.totalItems); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  // UI Actions
  onSelectCasesChange(value: 'All' | 'Open' | 'Closed' | 'On Hold'): void {
    this.selectedCaseFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
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
    if (this.currentPage > 1) { this.currentPage--; this.updatePagedCases(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagedCases(); }
  }

  trackById(_: number, item: MaintenanceIssue): string {
    return item.roomNumber + item.title; // Unique key
  }

  // Filtering & Pagination
  private applyAllFilters(): void {
    this.filteredCases = this.applyStatusFilter(this.allCases, this.selectedCaseFilter);
    this.updatePagedCases();
  }

  private applyStatusFilter(list: MaintenanceIssue[], selected: 'All' | 'Open' | 'Closed' | 'On Hold'): MaintenanceIssue[] {
    if (selected === 'All') return [...list];
    return list.filter(c => c.status === selected);
  }

  private updatePagedCases(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCases = this.filteredCases.slice(start, end);
  }

  // Action Handlers
  onAddNewMaintenance(): void {
    const dialogRef = this.dialog.open(MaintenanceManagementModalComponent, {
      width: '720px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: MaintenanceIssue) => {
      if (result) {
        result.status = 'Open'; // Default status
        this.allCases.unshift(result);
        this.applyAllFilters();
        console.log('New Maintenance Added:', result);
      }
    });
  }

  onEdit(issue: MaintenanceIssue): void {
    const dialogRef = this.dialog.open(MaintenanceManagementModalComponent, {
     width: '720px',
     maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      data: { issue: { ...issue } }
    });

    dialogRef.afterClosed().subscribe((updated: MaintenanceIssue) => {
      if (updated) {
        const idx = this.allCases.findIndex(i => i.roomNumber === issue.roomNumber && i.title === issue.title);
        if (idx !== -1) {
          this.allCases[idx] = { ...updated, status: this.allCases[idx].status };
          this.applyAllFilters();
        }
      }
    });
  }

  onDelete(issue: MaintenanceIssue): void {
    if (confirm(`Delete maintenance issue for Room ${issue.roomNumber}?`)) {
      this.allCases = this.allCases.filter(i => !(i.roomNumber === issue.roomNumber && i.title === issue.title));
      this.applyAllFilters();
    }
  }

  // Helper
  getPriorityClass(priority: string): string {
    return {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    }[priority] || '';
  }


  

}




