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
      title: 'ONBOARDING',
      icon: 'shield-lock',
      items: [
        { title: 'Clients', route: '/core/outlet-getAll' },
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
      icon: 'box-seam',
      items: [
        { title: 'Dashboard', route: '/core/inventory-dashboard' },
        { title: 'Units', route: '/core/inventory-unit' },
        { title: 'Items Categories', route: '/core/inventory-items-categories' },
        { title: 'Inventory Items', route: '/core/inventory-items' },
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
      icon: 'calendar-check',
      items: [
        { title: 'Plans', route: '/core/subscription-packages' },
        { title: 'My Subscription', route: '/core/subscription-packages' },
        { title: 'Billing History', route: '/core/subscription-billing-history' }
      ]
    },
    {
      key: 'tenants',
      title: 'TENANTS',
      icon: 'people',
      items: [
        { title: 'Announcements', route: '/core/tenant-announcements' },
           { title: 'Complaints', route: '/core/tenant-complaints' },
         { title: 'Menu', route: '/core/tenant-menu' },

      ]
      
    },
  ];
  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
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
    for (const group of this.collapsibleGroups) {
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
    for (const group of this.collapsibleGroups) {
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