
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * Interface for menu items
 */
interface MenuItem {
  title: string;
  route: string;
  privilege?: string;
}

/**
 * Interface for menu configuration
 */
interface MenuConfig {
  title: string;
  items: MenuItem[];
}

/**
 * Sidenav component with hover-based submenu (Keka-style)
 */
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit, OnDestroy {
  private closeTimeout: any;
  private isSubmenuHovered: boolean = false;
  selectedMenu: string = 'home';
  hoveredMenu: string | null = null;
  submenuPosition: { left: number, top: number } = { left: 0, top: 0 };
  private hoverTimeout: any;
  private leaveTimeout: any;
  privileges: string[] = [];
  filteredMenuConfig: { [key: string]: MenuConfig } = {};

  private readonly menuConfig: { [key: string]: MenuConfig } = {
    home: {
      title: 'Home',
      items: [
        { title: 'Dashboard', route: '/core/outlet-onboarding' },
        { title: 'Profile', route: '/core/profile' }
      ]
    },
    admin_panel_settings: {
      title: 'IAM',
      items: [
        { title: 'Users', route: '/uam/users' },
        { title: 'Roles', route: '/uam/roles' },
         { title: 'Roles Create', route: '/uam/role-details' },
        { title: 'Permissions', route: '/uam/permissions' }
      ]
    },
    groups: {
      title: 'Onboarding',
      items: [
        { title: 'Outlet', route: '/core/outlet-getAll' },
        { title: 'Staff', route: '/core/staff-onboarding-getAll' },
        { title: 'IAM', route: '/uam/users' }
      ]
    },
   rooms: {
      title: 'Rooms',
      items: [
        { title: 'Room Management', route: '/core/room-management' }
      ]
    },
    tenants: {
      title: 'Tenants',
      items: [
        { title: 'Tenant Management', route: '/core/tenant-management' }
      ]
    },
    payments: {
      title: 'Payments',
      items: [
        { title: 'Payment Management', route: '/core/payment-management' }
      ]
    },
    maintenance: {
      title: 'Maintenance',
      items: [
        { title: 'Maintenance Management', route: '/core/maintenance-management' }
      ]
    },
    expenses: {
      title: 'Expenses',
      items: [
        { title: 'Expenses Management', route: '/core/expenses-management' }
      ]
    }
  
  };

  isCollapsed: boolean = true;
  isMobile: boolean = false;
  private destroy$ = new Subject<void>();
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  constructor(private router: Router) {
    this.filterMenuByPrivileges();
    this.subscribeToRouterEvents();
  }


  ngOnInit(): void {
    this.checkScreenSize();
    this.updateSelectedMenuFromUrl(this.router.url); 
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
    }
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateSelectedMenuFromUrl(event.urlAfterRedirects);
      });
  }


  private updateSelectedMenuFromUrl(url: string): void {
    if (url.startsWith('/core/outlet')) {
      this.selectedMenu = 'home';
    } else if (url.startsWith('/uam')) {
      this.selectedMenu = 'admin_panel_settings';
    } else if (url.startsWith('/core/staff') || url.includes('onboarding')) {
      this.selectedMenu = 'groups';
    }else if (url.startsWith('/room-management')) {
      this.selectedMenu = 'rooms';
    } else if (url.startsWith('/tenant-management')) {
      this.selectedMenu = 'tenants';
    } else if (url.startsWith('/payment-management')) {
      this.selectedMenu = 'payments';
    } else if (url.startsWith('/maintenance-management')) {
      this.selectedMenu = 'maintenance';
    } else if (url.startsWith('/expenses-management')) {
      this.selectedMenu = 'expenses';
    } else {
      this.selectedMenu = 'home';
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    this.isCollapsed = this.isMobile;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onMenuHover(menu: string, event: MouseEvent): void {
    if (this.isMobile) return;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
    }
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.submenuPosition = {
      left: rect.right,
      top: rect.top + window.scrollY
    };

    this.hoverTimeout = setTimeout(() => {
      if (this.hasMenuItems(menu)) {
        this.hoveredMenu = menu;
      }
    }, 100);
  }

  onMenuLeave(): void {
    if (this.isMobile) return;

    // Clear hover timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Hide submenu after delay to allow mouse movement to submenu
    this.leaveTimeout = setTimeout(() => {
      this.hoveredMenu = null;
    }, 150);
  }

  /** Keep submenu open when hovering over it */
  keepSubmenuOpen(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
    }
  }

    closeSubmenu() {
    // When leaving submenu, close it
    this.isSubmenuHovered = false;
    this.closeTimeout = setTimeout(() => {
      this.hoveredMenu = null;
    }, 100);
  }

  /** Select a menu category and navigate */
  selectMenu(menu: string): void {
    this.selectedMenu = menu;
    const firstItemRoute = this.filteredMenuConfig[menu]?.items[0]?.route;
    if (firstItemRoute) {
      this.router.navigate([firstItemRoute]).catch(err => console.error('Navigation error:', err));
    }
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  /** Navigate to submenu item */
 navigateToSubmenu(item: MenuItem): void {
  this.router.navigate([item.route]).catch(err => {
    console.error(`Navigation error for route ${item.route}:`, err);
  });
  this.hoveredMenu = null;
  if (this.isMobile) {
    this.isCollapsed = true;
  }
}

  /** Filter menu items based on user privileges */
  private filterMenuByPrivileges(): void {
    this.filteredMenuConfig = {};
    
    for (const key of Object.keys(this.menuConfig)) {
      const section = this.menuConfig[key];
      const filteredItems = section.items.filter(item =>
        !item.privilege || this.privileges.includes(item.privilege)
      );

      if (filteredItems.length > 0) {
        this.filteredMenuConfig[key] = {
          ...section,
          items: filteredItems
        };
      }
    }
  }

  /** Get submenu title */
  getSubmenuTitle(): string {
    return this.hoveredMenu ? this.filteredMenuConfig[this.hoveredMenu]?.title || '' : '';
  }

  /** Get submenu items */
  getSubmenuItems(): MenuItem[] {
    return this.hoveredMenu ? this.filteredMenuConfig[this.hoveredMenu]?.items || [] : [];
  }

  /** Check if a menu category has items */
  hasMenuItems(menu: string): boolean {
    return !!this.filteredMenuConfig[menu]?.items && 
           this.filteredMenuConfig[menu].items.length > 0;
  }
}
