import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

type StaffStatus = 'Active' | 'Inactive' | 'On Leave' | 'Terminated';

export interface StaffListItem {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  role: string;   // System role from onboarding (Admin, Staff, etc.)
  phone: string;
  email: string;
  status: StaffStatus;
}

@Component({
  selector: 'app-staff-onboarding-get-all',
  templateUrl: './staff-onboarding-get-all.component.html',
  styleUrl: './staff-onboarding-get-all.component.scss'
})
export class StaffOnboardingGetAllComponent implements OnInit {

  // Toolbar filter
  public selectedStatusFilter: 'All' | StaffStatus = 'All';

  // Pagination
  public pageSizeOptions: number[] = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  // Data
  private allStaff: StaffListItem[] = [];
  public filteredStaff: StaffListItem[] = [];
  public pagedStaff: StaffListItem[] = [];

  constructor(
    private dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Seed sample staff data – fields match the onboarding popup
    this.allStaff = [
      {
        id: '1',
        employeeId: 'EMP-001',
        firstName: 'Ravi',
        lastName: 'Kumar',
        department: 'Front Office',
        designation: 'Receptionist',
        role: 'Staff',
        phone: '9876543210',
        email: 'ravi.kumar@example.com',
        status: 'Active'
      },
      {
        id: '2',
        employeeId: 'EMP-002',
        firstName: 'Anita',
        lastName: 'Sharma',
        department: 'Housekeeping',
        designation: 'Supervisor',
        role: 'Manager',
        phone: '9876501234',
        email: 'anita.sharma@example.com',
        status: 'On Leave'
      },
      {
        id: '3',
        employeeId: 'EMP-003',
        firstName: 'Mohit',
        lastName: 'Verma',
        department: 'Security',
        designation: 'Guard',
        role: 'Staff',
        phone: '9811112233',
        email: 'mohit.verma@example.com',
        status: 'Active'
      },
      {
        id: '4',
        employeeId: 'EMP-004',
        firstName: 'Priya',
        lastName: 'Nair',
        department: 'Administration',
        designation: 'Warden',
        role: 'Admin',
        phone: '9898989898',
        email: 'priya.nair@example.com',
        status: 'Inactive'
      },
      {
        id: '5',
        employeeId: 'EMP-005',
        firstName: 'Sanjay',
        lastName: 'Gupta',
        department: 'Maintenance',
        designation: 'Technician',
        role: 'Staff',
        phone: '9900123456',
        email: 'sanjay.gupta@example.com',
        status: 'Active'
      },
      {
        id: '6',
        employeeId: 'EMP-006',
        firstName: 'Deepa',
        lastName: 'Rao',
        department: 'Cafeteria',
        designation: 'Cook',
        role: 'Staff',
        phone: '9877001122',
        email: 'deepa.rao@example.com',
        status: 'Terminated'
      },
      {
        id: '7',
        employeeId: 'EMP-007',
        firstName: 'Arun',
        lastName: 'Menon',
        department: 'Front Office',
        designation: 'Assistant',
        role: 'Staff',
        phone: '9765432109',
        email: 'arun.menon@example.com',
        status: 'Active'
      }
    ];

    this.applyAllFilters();
  }

  /* -------------------  Pagination getters  ------------------- */

  get totalItems(): number {
    return this.filteredStaff.length;
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

  /* -------------------  Filter / Toolbar actions  ------------------- */

  onSelectStatusChange(value: 'All' | StaffStatus): void {
    this.selectedStatusFilter = value;
    this.currentPage = 1;
    this.applyAllFilters();
  }

  // Demo: clicking Filter cycles through statuses
  onFilter(): void {
    const order: Array<'All' | StaffStatus> = [
      'All',
      'Active',
      'Inactive',
      'On Leave',
      'Terminated'
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

  /* -------------------  Pagination actions  ------------------- */

  onPageSizeChange(size: number): void {
    this.pageSize = +size;
    this.currentPage = 1;
    this.updatePagedStaff();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedStaff();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedStaff();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedStaff();
    }
  }

  trackByStaffId(_: number, staff: StaffListItem): string {
    return staff.id;
  }

  /* -------------------  Core filtering + pagination  ------------------- */

  private applyAllFilters(): void {
    this.filteredStaff = this.applyStatusFilter(
      this.allStaff,
      this.selectedStatusFilter
    );
    this.updatePagedStaff();
  }

  private applyStatusFilter(
    list: StaffListItem[],
    selected: 'All' | StaffStatus
  ): StaffListItem[] {
    if (selected === 'All') return [...list];
    return list.filter(s => s.status === selected);
  }

  private updatePagedStaff(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedStaff = this.filteredStaff.slice(start, end);
  }

  /* -------------------  Navigation / CRUD  ------------------- */

  onAddNewStaff(): void {
    // Opens your onboarding popup/page
    this.router.navigate(['/core/staff-onboarding']);
  }

  onEditStaff(staff: StaffListItem): void {
    // Pass id if required by onboarding route
    this.router.navigate(['/core/staff-onboarding'], {
      queryParams: { id: staff.id }
    });
  }

  onDeleteStaff(staff: StaffListItem): void {
    if (confirm(`Delete staff ${staff.firstName} ${staff.lastName}?`)) {
      this.allStaff = this.allStaff.filter(s => s.id !== staff.id);
      this.applyAllFilters();
    }
  }
}