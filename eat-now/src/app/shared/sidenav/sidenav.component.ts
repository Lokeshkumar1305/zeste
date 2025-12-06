import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  Event as RouterEvent
} from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

interface MenuItem {
  title: string;
  route: string;
}

interface MenuGroup {
  key: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggle = new EventEmitter<void>();

  isMobile = window.innerWidth < 768;
  selectedMenu = 'dashboard';
  openedGroup: string | null = null;

  // vertical position for floating card (in px from top of viewport)
  floatingCardTop = 80;

  private destroy$ = new Subject<void>();

  collapsibleGroups: MenuGroup[] = [
    {
      key: 'onboarding',
      title: 'ONBOARDING',
      icon: 'shield-lock',
      items: [
        { title: 'Outlets', route: '/core/outlet-getAll' },
        { title: 'Staff', route: '/core/staff-onboarding-getAll' }
      ]
    },
    {
      key: 'iam',
      title: 'IAM',
      icon: 'shield-lock',
      items: [
        { title: 'User Access', route: '/core/user-access' },
        { title: 'User Profile', route: '/core/user-profile' }
      ]
    },
    {
      key: 'rooms',
      title: 'ROOMS',
      icon: 'building',
      items: [
        { title: 'Rooms', route: '/core/room-management' },
        { title: 'Floors', route: '/core/floors-management' },
        { title: 'Room Types', route: '/core/room-type-management' },
        { title: 'Beds', route: '/core/beds-management' },
        { title: 'Amenities', route: '/core/amenities-management' }
      ]
    },
    {
      key: 'tenants',
      title: 'TENANTS',
      icon: 'people',
      items: [{ title: 'Tenants', route: '/core/tenant-management' }]
    },
    {
      key: 'payments',
      title: 'PAYMENTS',
      icon: 'credit-card',
      items: [{ title: 'Payments', route: '/core/payment-management' }]
    },
    {
      key: 'maintenance',
      title: 'MAINTENANCE',
      icon: 'tools',
      items: [
        { title: 'Maintenance Requests', route: '/core/maintenance-management' },
        { title: 'Categories', route: '/core/maintenance-category' }
      ]
    },
    {
      key: 'expenses',
      title: 'EXPENSES',
      icon: 'receipt',
      items: [
        { title: 'Expenses', route: '/core/expenses-management' },
        { title: 'Categories', route: '/core/expenses-category' }
      ]
    },
    {
      key: 'menu',
      title: 'MENU & FOOD',
      icon: 'basket',
      items: [
         { title: 'Menu', route: '/core/menu-list' },
        { title: 'Menu Config', route: '/core/menu' },
      ]
    }
  ];

  constructor(private router: Router) {
    this.subscribeToRouterEvents();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateActiveMenu(this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    if (!this.isMobile && wasMobile) {
      this.isCollapsed = false;
      this.toggle.emit();
    }
  }

  // Click outside sidenav/floating card closes card
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const insideSidenav = target.closest('.sidenav');
    const insideCard = target.closest('.floating-card');

    if (!insideSidenav && !insideCard) {
      this.openedGroup = null;
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();

    // When expanding to full sidenav, close any open group
    if (!this.isCollapsed) {
      this.openedGroup = null;
    }
  }

  onGroupHeaderClick(event: MouseEvent, groupKey: string) {
    event.stopPropagation();

    // TOGGLE: if the same group is already open, close it
    if (this.openedGroup === groupKey) {
      this.openedGroup = null;
      return;
    }

    // Otherwise, open this group and position the floating card
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.floatingCardTop = rect.top;

    this.openedGroup = groupKey;

    console.log(
      'clicked groupKey =',
      groupKey,
      'openedGroup now =',
      this.openedGroup,
      'isCollapsed =',
      this.isCollapsed,
      'floatingCardTop =',
      this.floatingCardTop
    );
  }

  navigateTo(route: string, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    // Navigate but DO NOT close the dropdown on desktop
    this.router.navigate([route]);

    // On mobile, close sidenav + dropdown after selection
    if (this.isMobile) {
      this.isCollapsed = true;
      this.openedGroup = null;
      this.toggle.emit();
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isCollapsed = this.isMobile;
  }

  private subscribeToRouterEvents() {
    this.router.events
      .pipe(
        filter(
          (e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        this.updateActiveMenu(event.urlAfterRedirects);
      });
  }

  private updateActiveMenu(url: string) {
    if (
      url.includes('/core/outlet-onboarding') ||
      url === '/core' ||
      url === '/'
    ) {
      this.selectedMenu = 'dashboard';
      return;
    }

    for (const group of this.collapsibleGroups) {
      for (const item of group.items) {
        if (url.includes(item.route)) {
          this.selectedMenu = item.route;
          return;
        }
      }
    }
  }
}