// tenant-announcements.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  targetAudience: string;
  createdAt: Date;
  expiryDate?: Date;
  isActive: boolean;
  isRead?: boolean;
  author?: string;
}

@Component({
  selector: 'app-tenant-announcements',
  templateUrl: './tenant-announcements.component.html',
  styleUrls: ['./tenant-announcements.component.scss']
})
export class TenantAnnouncementsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  selectedAnnouncement: Announcement | null = null;

  selectedFilter: string = 'all';
  searchTerm: string = '';

  isLoading: boolean = false;

  stats = {
    total: 0,
    unread: 0,
    important: 0
  };

  filterOptions = [
    { value: 'all', label: 'All', icon: 'bi-list-ul' },
    { value: 'unread', label: 'Unread', icon: 'bi-envelope-fill' },
    { value: 'important', label: 'Important', icon: 'bi-star-fill' }
  ];

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAnnouncements(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.announcements = this.getMockAnnouncements();
      this.applyFilters();
      this.calculateStats();
      this.isLoading = false;
    }, 800);
  }

  getMockAnnouncements(): Announcement[] {
    return [
      {
        id: '1',
        title: 'Water Supply Maintenance - Building A',
        message: 'Dear Residents, We will be conducting routine water supply maintenance in Building A on Saturday, December 28th from 9:00 AM to 2:00 PM. Please ensure you have stored sufficient water for this period. We apologize for any inconvenience caused.',
        type: 'maintenance',
        priority: 'high',
        targetAudience: 'all_tenants',
        createdAt: new Date('2024-01-10'),
        expiryDate: new Date('2024-01-28'),
        isActive: true,
        isRead: false,
        author: 'Admin'
      },
      {
        id: '2',
        title: 'Community New Year Celebration',
        message: 'Join us for a wonderful New Year celebration at the community hall! Date: December 31st, Time: 7:00 PM onwards. There will be music, food, and fun activities for all ages. Please RSVP by December 25th.',
        type: 'event',
        priority: 'medium',
        targetAudience: 'all_tenants',
        createdAt: new Date('2024-01-08'),
        expiryDate: new Date('2024-01-31'),
        isActive: true,
        isRead: true,
        author: 'Community Manager'
      },
      {
        id: '3',
        title: 'Updated Parking Policy',
        message: 'Please be informed that the parking policy has been updated. All vehicles must display valid parking permits from January 1st, 2024. Unauthorized vehicles will be subject to towing. Contact the office to obtain your permit.',
        type: 'policy',
        priority: 'urgent',
        targetAudience: 'all_tenants',
        createdAt: new Date('2024-01-05'),
        expiryDate: new Date('2024-02-01'),
        isActive: true,
        isRead: false,
        author: 'Management'
      },
      {
        id: '4',
        title: 'Elevator Inspection Scheduled',
        message: 'Annual elevator inspection will be conducted on January 15th. The north elevator will be out of service from 10:00 AM to 4:00 PM. Please plan accordingly and use the south elevator.',
        type: 'maintenance',
        priority: 'medium',
        targetAudience: 'all_tenants',
        createdAt: new Date('2024-01-03'),
        expiryDate: new Date('2024-01-15'),
        isActive: true,
        isRead: true,
        author: 'Maintenance Team'
      },
      {
        id: '5',
        title: 'Gym Reopening After Renovation',
        message: 'Great news! Our community gym has been fully renovated with new equipment. It will reopen on January 20th with extended hours (5:00 AM - 11:00 PM). New membership cards will be issued.',
        type: 'general',
        priority: 'low',
        targetAudience: 'all_tenants',
        createdAt: new Date('2024-01-02'),
        expiryDate: new Date('2024-01-25'),
        isActive: true,
        isRead: false,
        author: 'Facilities Manager'
      },
      {
        id: '6',
        title: 'Fire Safety Drill - Mandatory Participation',
        message: 'A fire safety drill will be conducted on January 22nd at 3:00 PM. This is mandatory for all residents. Please familiarize yourself with emergency exits and assembly points. Safety officers will be present to guide you.',
        type: 'emergency',
        priority: 'urgent',
        targetAudience: 'all_tenants',
        createdAt: new Date('2024-01-01'),
        expiryDate: new Date('2024-01-22'),
        isActive: true,
        isRead: false,
        author: 'Safety Department'
      }
    ];
  }

  applyFilters(): void {
    let filtered = [...this.announcements];

    if (this.selectedFilter === 'unread') {
      filtered = filtered.filter(a => !a.isRead);
    } else if (this.selectedFilter === 'important') {
      filtered = filtered.filter(a => a.priority === 'urgent' || a.priority === 'high');
    }

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.message.toLowerCase().includes(search)
      );
    }

    this.filteredAnnouncements = filtered;
  }

  calculateStats(): void {
    this.stats.total = this.announcements.length;
    this.stats.unread = this.announcements.filter(a => !a.isRead).length;
    this.stats.important = this.announcements.filter(a => a.priority === 'urgent' || a.priority === 'high').length;
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  viewAnnouncement(announcement: Announcement): void {
    this.selectedAnnouncement = announcement;
    
    if (!announcement.isRead) {
      announcement.isRead = true;
      this.calculateStats();
    }
  }

  closeAnnouncementDetail(): void {
    this.selectedAnnouncement = null;
  }

  markAsRead(announcement: Announcement, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    announcement.isRead = true;
    this.calculateStats();
    this.applyFilters();
  }

  markAllAsRead(): void {
    this.announcements.forEach(a => a.isRead = true);
    this.calculateStats();
    this.applyFilters();
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      general: 'bi-info-circle-fill',
      maintenance: 'bi-tools',
      emergency: 'bi-exclamation-triangle-fill',
      event: 'bi-calendar-event-fill',
      policy: 'bi-shield-check'
    };
    return icons[type] || 'bi-bell-fill';
  }

  getTypeColor(type: string): string {
    const colors: any = {
      general: '#6c757d',
      maintenance: '#fd7e14',
      emergency: '#dc3545',
      event: '#198754',
      policy: '#0d6efd'
    };
    return colors[type] || '#6c757d';
  }

  getPriorityClass(priority: string): string {
    const classes: any = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    return classes[priority] || '';
  }

  isExpiringSoon(announcement: Announcement): boolean {
    if (!announcement.expiryDate) return false;
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return announcement.expiryDate <= threeDaysFromNow && announcement.expiryDate >= new Date();
  }

  getDaysUntilExpiry(announcement: Announcement): number {
    if (!announcement.expiryDate) return 0;
    const diff = announcement.expiryDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  refreshAnnouncements(): void {
    this.loadAnnouncements();
  }
}