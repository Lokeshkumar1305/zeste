import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BedsManagementModalComponent } from '../beds-management-modal/beds-management-modal.component';
import { Subscription } from 'rxjs';
import { Bed, BedsService } from '../../shared/services/beds.service';

@Component({
  selector: 'app-beds-management',
  templateUrl: './beds-management.component.html',
  styleUrls: ['./beds-management.component.scss']
})
export class BedsManagementComponent implements OnInit, OnDestroy {
  public selectedStatusFilter: 'All' | 'Available' | 'Occupied' | 'Maintenance' = 'All';

  public pageSizeOptions: number[] = [6, 12, 24];
  public pageSize = 6;
  public currentPage = 1;

  private allBeds: Bed[] = [];
  public filteredBeds: Bed[] = [];
  public pagedBeds: Bed[] = [];

  private subscription: Subscription | null = null;

  constructor(
    private dialog: MatDialog,
    private bedsService: BedsService
  ) { }

  ngOnInit(): void {
    this.subscription = this.bedsService.beds$.subscribe(beds => {
      this.allBeds = beds;
      this.applyAllFilters();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get totalItems(): number {
    return this.filteredBeds.length;
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

  onSelectStatusChange(value: 'All' | 'Available' | 'Occupied' | 'Maintenance'): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  onFilter(): void {
    const order: Array<'All' | 'Available' | 'Occupied' | 'Maintenance'> = ['All', 'Available', 'Occupied', 'Maintenance'];
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
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagedBeds();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedBeds();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedBeds();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedBeds();
    }
  }

  trackById(_: number, item: Bed): string {
    return item.id;
  }

  private applyAllFilters(): void {
    this.filteredBeds = this.applyStatusFilter(this.allBeds, this.selectedStatusFilter);
    this.updatePagedBeds();
  }

  private applyStatusFilter(list: Bed[], selected: 'All' | 'Available' | 'Occupied' | 'Maintenance'): Bed[] {
    if (selected === 'All') return [...list];
    return list.filter(b => b.status === selected);
  }

  private updatePagedBeds(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedBeds = this.filteredBeds.slice(start, end);
  }

  onAddNewBed(): void {
    const dialogRef = this.dialog.open(BedsManagementModalComponent, {
      width: '520px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: ['custom-dialog-container', 'full-screen-on-mobile'],
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bedsService.addBed(result); // assuming you have addBed method
      }
    });
  }

  onEditBed(bed: Bed): void {
    const dialogRef = this.dialog.open(BedsManagementModalComponent, {
      width: '520px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: ['custom-dialog-container', 'full-screen-on-mobile'],
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false,
      data: { bed }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bedsService.updateBed(result);
      }
    });
  }

  onDeleteBed(bed: Bed): void {
    if (confirm(`Are you sure you want to delete Bed ${bed.bedNumber || bed.id}?`)) {
      this.bedsService.deleteBed(bed.id);
    }
  }
}