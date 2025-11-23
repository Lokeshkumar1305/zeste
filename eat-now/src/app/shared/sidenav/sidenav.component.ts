// sidenav.component.ts
import { Component, HostListener, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

interface MenuItem {
  title: string;
  route: string;
  icon?: string;
}

interface MenuGroup {
  key: string;
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = true;
  @Output() toggle = new EventEmitter<void>();

  isMobile = window.innerWidth < 768;
  selectedMenu = 'dashboard';

  private destroy$ = new Subject<void>();

  private menuGroupsConfig: MenuGroup[] = [
    {
      key: 'onboarding',
      title: 'ONBOARDING',
      items: [
        { title: 'Outlets', route: '/core/outlet-getAll' },
        { title: 'Staff', route: '/core/staff-onboarding-getAll' }
      ]
    },
    {
      key: 'rooms',
      title: 'ROOMS',
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
      items: [
        { title: 'Tenants', route: '/core/tenant-management' }
      ]
    },
    {
      key: 'payments',
      title: 'PAYMENTS',
      items: [
        { title: 'Payments', route: '/core/payment-management' }
      ]
    },
    {
      key: 'maintenance',
      title: 'MAINTENANCE',
      items: [
        { title: 'Maintenance Requests', route: '/core/maintenance-management' },
        { title: 'Categories', route: '/core/maintenance-category' }
      ]
    },
    {
      key: 'expenses',
      title: 'EXPENSES',
      items: [
        { title: 'Outlets', route: '/core/outlet-getAll' },
        { title: 'Staff', route: '/core/staff-onboarding-getAll' }
      ]
    },
    {
      key: 'menu',
      title: 'MENU & FOOD',
      items: [
        { title: 'Menu', route: '/core/menu' },
        { title: 'Items', route: '/core/items' },
        { title: 'Categories', route: '/core/category' }
      ]
    }
  ];



// Only the changed part — replace your menu config with this:

collapsibleGroups = [

  {
    key: 'onboarding',
    title: 'ONBOARDING',
    icon: 'shield-lock',
    items: [
      { title: 'User Access', route: '/core/user-access' },
      { title: 'User Profile', route: '/core/user-profile' }
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
    title: 'ROOMS ',
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
    icon: 'shield-lock',
    items: [
      { title: 'Tenants', route: '/core/tenant-management' }
    ]
  },
  {
    key: 'payments',
    title: 'PAYMENTS',
    icon: 'gear',
    items: [
      { title: 'Payments', route: '/core/payment-management' }
    ] 
  },
  {
    key: 'maintenance',
    title: 'MAINTENANCE',
    icon: 'building',
    items: [
      { title: 'Maintenance Requests', route: '/core/maintenance-management' },
      { title: 'Categories', route: '/core/maintenance-category' }
    ]
  },
   {
    key: 'expenses',
    title: 'Expenses',
    icon: 'gear',
    items: [
      { title: 'Expenses', route: '/core/expenses-management' },
      { title: 'Categories', route: '/core/expenses-category' }
    ] 
  },
  {
    key: 'menu',
    title: 'Menu',
    icon: 'building',
    items: [
      { title: 'Expenses', route: '/core/expenses-management' },
        { title: 'Categories', route: '/core/expenses-category' }
    ]
  },
  // Add more groups as needed
];

// Keep your toggleGroup(), navigateTo(), isRouteActive() same as before
openedGroup: string | null = 'rooms'; // auto-open ROOMS on load if you want



  menuGroups = this.menuGroupsConfig.map(g => g.key);
  filteredMenuConfig: { [key: string]: any } = {};

  constructor(private router: Router) {
    this.buildMenuConfig();
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
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile && this.isCollapsed) {
      this.isCollapsed = false;
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed && this.isMobile) {
      this.openedGroup = null; // Close all when collapsing on mobile
    }
  }

  toggleGroup(groupKey: string) {
    this.openedGroup = this.openedGroup === groupKey ? null : groupKey;

    if (this.isMobile) {
      setTimeout(() => this.isCollapsed = true, 300);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile && this.isCollapsed) {
      this.isCollapsed = false;
    }
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
    if (url.includes('/core/outlet-onboarding') || url === '/core' || url === '/') {
      this.selectedMenu = 'dashboard';
      this.openedGroup = null;
      return;
    }

    let foundGroup: string | null = null;

    for (const group of this.menuGroupsConfig) {
      for (const item of group.items) {
        if (url.includes(item.route)) {
          this.selectedMenu = item.route;
          foundGroup = group.key;
          break;
        }
      }
      if (foundGroup) break;
    }

    this.openedGroup = foundGroup; // Auto-open correct group
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  getIconForRoute(route: string): string {
    const iconMap: { [key: string]: string } = {
      'dashboard': 'speedometer2',
      'outlet': 'building',
      'staff': 'people',
      'room': 'door-open',
      'floors': 'layers',
      'room-type': 'grid-3x3-gap',
      'beds': 'bed',
      'amenities': 'star',
      'tenant': 'person-badge',
      'payment': 'credit-card',
      'maintenance': 'tools',
      'expenses': 'receipt',
      'menu': 'journal-text',
      'items': 'basket',
      'category': 'tags'
    };

    return Object.keys(iconMap).find(key => route.includes(key)) 
      ? iconMap[Object.keys(iconMap).find(key => route.includes(key))!] 
      : 'circle';
  }

  private buildMenuConfig() {
    this.filteredMenuConfig = {};
    this.menuGroupsConfig.forEach(group => {
      this.filteredMenuConfig[group.key] = {
        title: group.title,
        items: group.items
      };
    });
  }
}