import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../services/theme.service';
import { LayoutService } from '../services/layout.service';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() sidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  isMobile = false;
  isTablet = false;

  userName = 'Lokesh Kumar';
  userRole = 'Admin';
  userEmail = 'lokesh.kumar@zeste.com';
  userAvatar: string | null = null;
  loggedInUser = '';

  notifications: Notification[] = [];
  notificationCount = 0;

  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly theme: ThemeService,
    public layout: LayoutService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.initializeUser();
    this.initializeTheme();
    this.loadNotifications();
    this.subscribeToLayoutChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < this.MOBILE_BREAKPOINT;
    this.isTablet =
      width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;
  }

  private initializeUser(): void {
    this.loggedInUser = sessionStorage.getItem('loggedInUser') || '';
    if (this.loggedInUser && !this.userName) {
      this.userName = this.formatUserName(this.loggedInUser);
    }
  }

  private formatUserName(email: string): string {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  get userInitials(): string {
    return this.userName
      .split(' ')
      .filter(Boolean)
      .map(p => p[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  private initializeTheme(): void {
    const state = this.theme.getState();
    this.theme.init();
    document.documentElement.setAttribute('data-brand-color', state.color);
    document.body.classList.toggle('dark-theme', state.mode === 'dark');
  }

  private subscribeToLayoutChanges(): void {
    this.layout.collapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => (this.sidebarCollapsed = collapsed));
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  // Notifications
  private loadNotifications(): void {
    this.notifications = [
      {
        id: 1,
        title: 'Leave approved',
        description: 'Your leave request for Dec 20–22 has been approved.',
        time: '2 hours ago',
        type: 'success',
        read: false
      },
      {
        id: 2,
        title: 'Meeting reminder',
        description: 'Team sync scheduled at 3:00 PM today.',
        time: '5 hours ago',
        type: 'info',
        read: false
      },
      {
        id: 3,
        title: 'New announcement',
        description: 'Company holiday list for 2026 is now available.',
        time: '1 day ago',
        type: 'warning',
        read: true
      }
    ];
    this.updateNotificationCount();
  }

  private updateNotificationCount(): void {
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => (n.read = true));
    this.updateNotificationCount();
  }

  onNotificationClick(notification: Notification): void {
    notification.read = true;
    this.updateNotificationCount();
  }

  dismissNotification(notification: Notification, event: MouseEvent): void {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    this.updateNotificationCount();
  }

  viewAllNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle';
      case 'warning':
        return 'bi-exclamation-triangle';
      case 'error':
        return 'bi-x-circle';
      default:
        return 'bi-info-circle';
    }
  }

  goToProfile(): void {
    this.router.navigate(['/uam/user-profile/1']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  psdChange(): void {
    this.router.navigate(['/core/change-password']);
  }

  goToHelp(): void {
    this.router.navigate(['/help']);
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}