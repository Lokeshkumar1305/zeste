import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Announcement,
  AnnouncementFilter,
  AnnouncementType,
  Priority
} from '../../common-library/model';
import { AnnouncementsService } from '../../shared/services/announcements.service';
import { AnnouncementsModalComponent } from '../announcements-modal/announcements-modal.component';

/** Custom labels: "Rows per page" + "Showing 1 to 5 of 7 entries" */
export class AnnouncementPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Rows per page:';

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0 || pageSize === 0) {
      return 'Showing 0 of 0 entries';
    }

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `Showing ${startIndex + 1} to ${endIndex} of ${length} entries`;
  };
}

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: AnnouncementPaginatorIntl }]
})
export class AnnouncementsComponent implements OnInit, AfterViewInit {
  announcements: Announcement[] = [];
  dataSource!: MatTableDataSource<Announcement>;
  displayedColumns: string[] = [
    'type',
    'title',
    'priority',
    'targetAudience',
    'createdAt',
    'status',
    'actions'
  ];

  isLoading: boolean = false;
  viewMode: 'cards' | 'table' = 'cards';

  // Filter options
  selectedType: AnnouncementType | '' = '';
  selectedPriority: Priority | '' = '';
  selectedStatus: boolean | '' = '';
  searchTerm: string = '';

  // Stats
  stats = {
    total: 0,
    active: 0,
    urgent: 0,
    expiringSoon: 0
  };

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  announcementTypes = [
    {
      value: AnnouncementType.GENERAL,
      label: 'General',
      icon: 'bi-info-circle',
      color: '#6c757d'
    },
    {
      value: AnnouncementType.MAINTENANCE,
      label: 'Maintenance',
      icon: 'bi-tools',
      color: '#17a2b8'
    },
    {
      value: AnnouncementType.EMERGENCY,
      label: 'Emergency',
      icon: 'bi-exclamation-triangle',
      color: '#dc3545'
    },
    {
      value: AnnouncementType.EVENT,
      label: 'Event',
      icon: 'bi-calendar-event',
      color: '#6f42c1'
    },
    {
      value: AnnouncementType.PAYMENT,
      label: 'Payment',
      icon: 'bi-credit-card',
      color: '#28a745'
    },
    {
      value: AnnouncementType.RULES,
      label: 'Rules',
      icon: 'bi-journal-text',
      color: '#fd7e14'
    }
  ];

  priorities = [
    { value: Priority.LOW, label: 'Low', color: 'success' },
    { value: Priority.MEDIUM, label: 'Medium', color: 'info' },
    { value: Priority.HIGH, label: 'High', color: 'warning' },
    { value: Priority.URGENT, label: 'Urgent', color: 'danger' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private announcementService: AnnouncementsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    const filter: AnnouncementFilter = {};

    if (this.selectedType) filter.type = this.selectedType;
    if (this.selectedPriority) filter.priority = this.selectedPriority;
    if (this.selectedStatus !== '')
      filter.isActive = this.selectedStatus as boolean;
    if (this.searchTerm) filter.searchTerm = this.searchTerm;

    this.announcementService.getAnnouncements(filter).subscribe({
      next: (data) => {
        this.announcements = data;
        this.dataSource = new MatTableDataSource(data);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
        this.showSnackBar('Error loading announcements', 'error');
        this.isLoading = false;
      }
    });
  }

  onMatPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }

  calculateStats(): void {
    const now = new Date();
    const threeDaysFromNow = new Date(
      now.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    this.stats = {
      total: this.announcements.length,
      active: this.announcements.filter((a) => a.isActive).length,
      urgent: this.announcements.filter(
        (a) => a.priority === Priority.URGENT && a.isActive
      ).length,
      expiringSoon: this.announcements.filter(
        (a) =>
          a.expiryDate &&
          new Date(a.expiryDate) <= threeDaysFromNow &&
          a.isActive
      ).length
    };
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AnnouncementsModalComponent, {
      width: '520px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: ['custom-dialog-container', 'full-screen-on-mobile'],
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.showSnackBar('Announcement created successfully!', 'success');
        this.loadAnnouncements();
      }
    });
  }

  openEditDialog(announcement: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementsModalComponent, {
      width: '520px',
      maxWidth: '100vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: ['custom-dialog-container', 'full-screen-on-mobile'],
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      data: { isEdit: true, announcement }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.showSnackBar('Announcement updated successfully!', 'success');
        this.loadAnnouncements();
      }
    });
  }

  deleteAnnouncement(announcement: Announcement): void {
    if (confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      this.announcementService.deleteAnnouncement(announcement.id).subscribe({
        next: () => {
          this.showSnackBar('Announcement deleted successfully!', 'success');
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Error deleting announcement:', error);
          this.showSnackBar('Error deleting announcement', 'error');
        }
      });
    }
  }

  toggleStatus(announcement: Announcement): void {
    this.announcementService.toggleAnnouncementStatus(
      announcement.id
    ).subscribe({
      next: (updated) => {
        const status = updated.isActive ? 'activated' : 'deactivated';
        this.showSnackBar(`Announcement ${status} successfully!`, 'success');
        this.loadAnnouncements();
      },
      error: (error) => {
        console.error('Error toggling status:', error);
        this.showSnackBar('Error updating status', 'error');
      }
    });
  }

  applyFilter(): void {
    this.loadAnnouncements();
  }

  clearFilters(): void {
    this.selectedType = '';
    this.selectedPriority = '';
    this.selectedStatus = '';
    this.searchTerm = '';
    this.loadAnnouncements();
  }

  getTypeInfo(type: AnnouncementType) {
    return this.announcementTypes.find((t) => t.value === type);
  }

  getPriorityInfo(priority: Priority) {
    return this.priorities.find((p) => p.value === priority);
  }

  getTargetAudienceLabel(audience: string): string {
    const labels: { [key: string]: string } = {
      all: 'All Tenants',
      specific_rooms: 'Specific Rooms',
      specific_floors: 'Specific Floors',
      new_tenants: 'New Tenants'
    };
    return labels[audience] || audience;
  }

  isExpiringSoon(date: Date | undefined): boolean {
    if (!date) return false;
    const now = new Date();
    const expiry = new Date(date);
    const diffDays = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 3 && diffDays >= 0;
  }

  isExpired(date: Date | undefined): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  trackByFn(index: number, item: Announcement): number {
    return item.id;
  }

  // ---------- Custom paginator helpers ----------

  getPageNumbers(paginator: MatPaginator | null | undefined): number[] {
    if (!paginator) return [];
    const length = paginator.length ?? 0;
    const pageSize = paginator.pageSize || 0;
    if (length === 0 || pageSize === 0) return [];
    const totalPages = Math.ceil(length / pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  hasPreviousPage(paginator: MatPaginator | null | undefined): boolean {
    return !!paginator && paginator.pageIndex > 0;
  }

  hasNextPage(paginator: MatPaginator | null | undefined): boolean {
    if (!paginator) return false;
    const length = paginator.length ?? 0;
    const pageSize = paginator.pageSize || 0;
    if (length === 0 || pageSize === 0) return false;
    const totalPages = Math.ceil(length / pageSize);
    return paginator.pageIndex < totalPages - 1;
  }

  goToPreviousPage(paginator: MatPaginator | null | undefined): void {
    if (paginator && this.hasPreviousPage(paginator)) {
      paginator.previousPage();
    }
  }

  goToNextPage(paginator: MatPaginator | null | undefined): void {
    if (paginator && this.hasNextPage(paginator)) {
      paginator.nextPage();
    }
  }

  goToPage(paginator: MatPaginator | null | undefined, pageIndex: number): void {
    if (!paginator) return;
    const length = paginator.length ?? 0;
    const pageSize = paginator.pageSize || 0;
    if (length === 0 || pageSize === 0) return;
    const totalPages = Math.ceil(length / pageSize);
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    paginator.pageIndex = pageIndex;
    (paginator as any)._changePageSize(paginator.pageSize);
    return;
  }

  onCustomPageSizeChange(paginator: MatPaginator | null | undefined, value: any): void {
    if (!paginator) return;
    const newSize = Number(value);
    if (!newSize) return;
    (paginator as any)._changePageSize(newSize);
  }

  getCustomRangeLabel(paginator: MatPaginator | null | undefined): string {
    if (!paginator || !paginator.length) return 'Showing 0 to 0 of 0 entries';
    const startIndex = paginator.pageIndex * paginator.pageSize;
    const endIndex = Math.min(startIndex + paginator.pageSize, paginator.length);
    return `Showing ${startIndex + 1} to ${endIndex} of ${paginator.length} entries`;
  }
}