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
        { title: 'Users', route: '/uam/users' },
         { title: 'Roles', route: '/uam/roles' },
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
        { title: 'Menu Config', route: '/core/menu' }
      ]
    },
    {
      key: 'inventory',
      title: 'INVENTORY',
      icon: 'box-seam', // Valid Bootstrap icon for inventory
      items: [
        { title: 'Dashboard', route: '/core/inventory-dashboard' },
        { title: 'Units', route: '/core/inventory-unit' },
        { title: 'Inventory Items', route: '/core/inventory-items' },
        { title: 'Items Categories', route: '/core/inventory-items-categories' },
        { title: 'Inventory Stocks', route: '/core/inventory-stocks' },
        { title: 'Inventory Movements', route: '/core/inventory-movements' },
        { title: 'Purchase Orders', route: '/core/inventory-purchase-orders' },
        { title: 'Suppliers', route: '/core/inventory-suppliers' },
        { title: 'Reports', route: '/core/inventory-reports' },
        { title: 'Settings', route: '/core/inventory-settings' }
      ]
    },
    {
      key: 'subscription',
      title: 'SUBSCRIPTION',
      icon: 'calendar-check', // or 'card-checklist', 'bookmark-star', 'patch-check'
      items: [
        { title: 'Plans', route: '/core/subscription-packages' },
        { title: 'My Subscription', route: '/core/subscription-packages' },
        { title: 'Billing History', route: '/core/subscription-billing-history' }
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

  /**
   * FIX: Only close floating card in collapsed mode when clicking outside.
   * In expanded mode, submenus should stay open regardless of main content clicks.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // In expanded mode, don't close submenus on outside clicks
    if (!this.isCollapsed) {
      return;
    }

    // In collapsed mode, close floating card when clicking outside sidenav
    const target = event.target as HTMLElement;
    const insideSidenav = target.closest('.sidenav');
    const insideCard = target.closest('.floating-card');
    const insideHamburger = target.closest('.mobile-hamburger');

    if (!insideSidenav && !insideCard && !insideHamburger) {
      this.openedGroup = null;
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();

    // When expanding to full sidenav, auto-open the group containing active route
    if (!this.isCollapsed) {
      this.autoOpenActiveGroup();
    } else {
      // When collapsing, close any open group
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
  }

  navigateTo(route: string, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    // Navigate
    this.router.navigate([route]);

    // On mobile, close sidenav after selection
    if (this.isMobile) {
      this.isCollapsed = true;
      this.openedGroup = null;
      this.toggle.emit();
    }
    // On desktop in collapsed mode, close the floating card after selection
    else if (this.isCollapsed) {
      this.openedGroup = null;
    }
    // On desktop in expanded mode, keep the submenu open (do nothing)
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  /**
   * Check if any item in a group is currently active
   */
  isGroupActive(group: MenuGroup): boolean {
    return group.items.some(item => this.router.url.includes(item.route));
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
      // In expanded mode, keep the active group open
      if (!this.isCollapsed) {
        this.autoOpenActiveGroup();
      }
      return;
    }

    for (const group of this.collapsibleGroups) {
      for (const item of group.items) {
        if (url.includes(item.route)) {
          this.selectedMenu = item.route;
          // In expanded mode, auto-open the group containing the active route
          if (!this.isCollapsed) {
            this.openedGroup = group.key;
          }
          return;
        }
      }
    }
  }

  /**
   * Auto-open the group that contains the currently active route
   */
  private autoOpenActiveGroup() {
    for (const group of this.collapsibleGroups) {
      for (const item of group.items) {
        if (this.router.url.includes(item.route)) {
          this.openedGroup = group.key;
          return;
        }
      }
    }
  }
}