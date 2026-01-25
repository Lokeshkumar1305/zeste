import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  Renderer2
} from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
interface MenuItem {
  title: string;
  route: string;
  icon?: string;
}
interface MenuGroup {
  key: string;
  title: string;
  icon: string;
  items: MenuItem[];
  expanded?: boolean;
}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggle = new EventEmitter<void>();

  isMobile = false;
  isTablet = false;
  selectedMenu = 'dashboard';
  openedGroup: string | null = null;
  floatingCardTop = 80;

  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;
  private destroy$ = new Subject<void>();

  collapsibleGroups: MenuGroup[] = [
    {
      key: 'onboarding',
      title: 'NAV.ONBOARDING',
      icon: 'shield-lock',
      items: [
        { title: 'NAV.CLIENTS', route: '/core/outlet-getAll' },
        { title: 'NAV.STAFF', route: '/core/staff-onboarding-getAll' }
      ]
    },
    {
      key: 'iam',
      title: 'NAV.IAM',
      icon: 'person-badge',
      items: [
        { title: 'NAV.USERS', route: '/uam/users' },
        { title: 'NAV.ROLES', route: '/uam/roles' },
        { title: 'NAV.USER_PROFILE', route: '/core/user-profile' }
      ]
    },
    {
      key: 'rooms',
      title: 'NAV.ROOMS',
      icon: 'building',
      items: [
        { title: 'NAV.ROOMS', route: '/core/room-management' },
        { title: 'NAV.FLOORS', route: '/core/floors-management' },
        { title: 'NAV.ROOM_TYPES', route: '/core/room-type-management' },
        { title: 'NAV.BEDS', route: '/core/beds-management' },
        { title: 'NAV.AMENITIES', route: '/core/amenities-management' }
      ]
    },
    {
      key: 'tenants',
      title: 'NAV.TENANTS',
      icon: 'people',
      items: [{ title: 'NAV.TENANTS', route: '/core/tenant-management' }]
    },
    {
      key: 'payments',
      title: 'NAV.PAYMENTS',
      icon: 'credit-card',
      items: [{ title: 'NAV.PAYMENTS', route: '/core/payment-management' }]
    },
    {
      key: 'maintenance',
      title: 'NAV.MAINTENANCE',
      icon: 'tools',
      items: [
        { title: 'NAV.MAINTENANCE_REQUESTS', route: '/core/maintenance-management' },
        { title: 'NAV.CATEGORIES', route: '/core/maintenance-category' }
      ]
    },
    {
      key: 'expenses',
      title: 'NAV.EXPENSES',
      icon: 'receipt',
      items: [
        { title: 'NAV.EXPENSES', route: '/core/expenses-management' },
        { title: 'NAV.CATEGORIES', route: '/core/expenses-category' }
      ]
    },
    {
      key: 'menu',
      title: 'NAV.MENU',
      icon: 'basket',
      items: [
        { title: 'NAV.MENU_LIST', route: '/core/menu-list' },
        { title: 'NAV.MENU_CONFIG', route: '/core/menu' }
      ]
    },
    {
      key: 'inventory',
      title: 'NAV.INVENTORY',
      icon: 'box-seam',
      items: [
        { title: 'NAV.DASHBOARD', route: '/core/inventory-dashboard' },
        { title: 'NAV.UNITS', route: '/core/inventory-unit' },
        { title: 'NAV.ITEMS_CATEGORIES', route: '/core/inventory-items-categories' },
        { title: 'NAV.INVENTORY_ITEMS', route: '/core/inventory-items' },
        { title: 'NAV.INVENTORY_STOCKS', route: '/core/inventory-stocks' },
        { title: 'NAV.INVENTORY_MOVEMENTS', route: '/core/inventory-movements' },
        { title: 'NAV.PURCHASE_ORDERS', route: '/core/inventory-purchase-orders' },
        { title: 'NAV.SUPPLIERS', route: '/core/inventory-suppliers' },
        { title: 'NAV.REPORTS', route: '/core/inventory-reports' },
        { title: 'NAV.SETTINGS', route: '/core/inventory-settings' }
      ]
    },
    {
      key: 'subscription',
      title: 'NAV.SUBSCRIPTION',
      icon: 'calendar-check',
      items: [
        { title: 'NAV.PLANS', route: '/core/subscription-packages' },
        { title: 'NAV.MY_SUBSCRIPTION', route: '/core/subscription-packages' },
        { title: 'NAV.BILLING_HISTORY', route: '/core/subscription-billing-history' }
      ]
    },
    {
      key: 'tenants_alt',
      title: 'NAV.TENANTS_PORTAL',
      icon: 'people',
      items: [
        { title: 'NAV.ANNOUNCEMENTS', route: '/core/tenant-announcements' },
        { title: 'NAV.COMPLAINTS', route: '/core/tenant-complaints' },
        { title: 'NAV.MENU', route: '/core/tenant-menu' },
        { title: 'NAV.PAY_RENT', route: '/core/tenant-pay-rent' }
      ]
    }
  ];

  settingsGroups: MenuGroup[] = [
    {
      key: 'config',
      title: 'NAV.CONFIG',
      icon: 'gear',
      items: [
        { title: 'NAV.PRODUCT_CONFIG', route: '/features/config/product-config' },
        { title: 'NAV.SYSTEM_CONFIG', route: '/features/config/system-config' },
        { title: 'NAV.PAYMENT_CONFIG', route: '/features/config/payment-config' },
        { title: 'NAV.THEME_CONFIG', route: '/features/config/theme-config' },
        { title: 'NAV.DYNAMIC_INPUTS', route: '/features/config/dynamic-inputs' }
      ]
    }
  ];

  get allGroups(): MenuGroup[] {
    return [...this.collapsibleGroups, ...this.settingsGroups];
  }

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateActiveMenu(this.router.url);
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    const wasMobile = this.isMobile;
    this.checkScreenSize();
    if (this.isMobile && !wasMobile && !this.isCollapsed) {
      this.isCollapsed = true;
      this.toggle.emit();
    }
    if (!this.isMobile && this.isCollapsed) {
      this.openedGroup = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMobile || !this.isCollapsed || !this.openedGroup) {
      return;
    }
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    const clickedFloatingCard = target.closest('.floating-card');
    if (!clickedInside && !clickedFloatingCard) {
      this.openedGroup = null;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMobile && !this.isCollapsed) {
      this.toggleSidenav();
    }
    if (this.openedGroup) {
      this.openedGroup = null;
    }
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < this.MOBILE_BREAKPOINT;
    this.isTablet = width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter(
          (event: RouterEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.updateActiveMenu(event.urlAfterRedirects);
      });
  }

  private updateActiveMenu(url: string): void {
    if (this.isDashboardUrl(url)) {
      this.selectedMenu = 'dashboard';
      if (!this.isCollapsed && !this.isMobile) {
        this.autoOpenActiveGroup();
      }
      return;
    }
    for (const group of this.allGroups) {
      for (const item of group.items) {
        if (url.includes(item.route)) {
          this.selectedMenu = item.route;
          if (!this.isCollapsed && !this.isMobile) {
            this.openedGroup = group.key;
          }
          return;
        }
      }
    }
  }

  private isDashboardUrl(url: string): boolean {
    return (
      url.includes('/core/outlet-onboarding') ||
      url === '/core' ||
      url === '/' ||
      url === '/dashboard'
    );
  }

  private autoOpenActiveGroup(): void {
    for (const group of this.allGroups) {
      for (const item of group.items) {
        if (this.router.url.includes(item.route)) {
          this.openedGroup = group.key;
          return;
        }
      }
    }
  }

  toggleSidenav(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();
    if (!this.isCollapsed) {
      this.autoOpenActiveGroup();
    } else {
      this.openedGroup = null;
    }
  }

  onGroupHeaderClick(event: Event, groupKey: string): void {
    event.stopPropagation();
    if (this.openedGroup === groupKey) {
      this.openedGroup = null;
      return;
    }
    if (this.isCollapsed && !this.isMobile) {
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      this.floatingCardTop = rect.top;
    }
    this.openedGroup = groupKey;
  }

  navigateTo(route: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate([route]);
    this.selectedMenu = route;
    if (this.isMobile) {
      this.isCollapsed = true;
      this.openedGroup = null;
      this.toggle.emit();
    } else if (this.isCollapsed) {
      this.openedGroup = null;
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  isGroupActive(group: MenuGroup): boolean {
    return group.items.some((item) => this.isRouteActive(item.route));
  }

  trackByGroupKey(index: number, group: MenuGroup): string {
    return group.key;
  }

  trackByRoute(index: number, item: MenuItem): string {
    return item.route;
  }
}
