import { Component, HostListener, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
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
  @Input() isCollapsed = false;  // ✅ Added @Input decorator
  @Output() toggle = new EventEmitter<void>();  // ✅ Added @Output decorator

  isMobile = window.innerWidth < 768;
  selectedMenu = 'dashboard';
  openedGroup: string | null = null;

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
      items: [
        { title: 'Tenants', route: '/core/tenant-management' }
      ]
    },
    {
      key: 'payments',
      title: 'PAYMENTS',
      icon: 'credit-card',
      items: [
        { title: 'Payments', route: '/core/payment-management' }
      ]
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
        { title: 'Menu', route: '/core/menu' },
        { title: 'Items', route: '/core/items' },
        { title: 'Categories', route: '/core/category' }
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
    
    // Auto-expand on desktop, auto-collapse on mobile
    if (!this.isMobile && wasMobile) {
      this.isCollapsed = false;
      this.toggle.emit();  // ✅ Emit to parent
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();  // ✅ Emit to parent
    
    // Close all groups when collapsing
    if (this.isCollapsed) {
      this.openedGroup = null;
    }
  }

  toggleGroup(groupKey: string) {
    // If collapsed, show floating menu; if expanded, toggle inline submenu
    if (this.openedGroup === groupKey) {
      this.openedGroup = null;
    } else {
      this.openedGroup = groupKey;
    }

    // On mobile, close sidenav after selection
    if (this.isMobile && !this.isCollapsed) {
      setTimeout(() => {
        this.isCollapsed = true;
        this.toggle.emit();  // ✅ Emit to parent
      }, 300);
    }
  }

  closeFloatingMenu() {
    this.openedGroup = null;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    
    // Close floating menu after navigation
    if (this.isCollapsed) {
      this.openedGroup = null;
    }
    
    // Close mobile menu
    if (this.isMobile) {
      this.isCollapsed = true;
      this.toggle.emit();  // ✅ Emit to parent
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
        filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.updateActiveMenu(event.urlAfterRedirects);
      });
  }

  private updateActiveMenu(url: string) {
    // Check if dashboard
    if (url.includes('/core/outlet-onboarding') || url === '/core' || url === '/') {
      this.selectedMenu = 'dashboard';
      if (!this.isCollapsed) {
        this.openedGroup = null;
      }
      return;
    }

    // Find which group and item matches current route
    let foundGroup: string | null = null;

    for (const group of this.collapsibleGroups) {
      for (const item of group.items) {
        if (url.includes(item.route)) {
          this.selectedMenu = item.route;
          foundGroup = group.key;
          break;
        }
      }
      if (foundGroup) break;
    }

    // Auto-open the group containing active route (only when expanded)
    if (!this.isCollapsed) {
      this.openedGroup = foundGroup;
    }
  }
}