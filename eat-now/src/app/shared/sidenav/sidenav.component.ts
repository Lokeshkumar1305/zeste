import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

interface MenuItem {
  title: string;
  route: string;
  privilege?: string;
}
interface MenuConfig {
  title: string;
  items: MenuItem[];
}

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
  /* ------------------------------------------------------------------ */
  /*  Variables                                                         */
  /* ------------------------------------------------------------------ */
  private closeTimeout: any;
  private isSubmenuHovered = false;
  selectedMenu = 'home'; // Will be driven by URL
  hoveredMenu: string | null = null;
  submenuPosition = { left: 0, top: 0 };
  private hoverTimeout: any;
  private leaveTimeout: any;
  privileges: string[] = [];
  filteredMenuConfig: { [key: string]: MenuConfig } = {};

  private readonly menuConfig: { [key: string]: MenuConfig } = {
    home: { title: 'Home', items: [
      { title: 'Dashboard', route: '/core/outlet-onboarding' }, 
      { title: 'Profile', route: '/core/profile' }
    ]},
    admin_panel_settings: { title: 'IAM', items: [
      { title: 'Users', route: '/uam/users' }, 
      { title: 'Roles', route: '/uam/roles' }, 
      { title: 'Roles Create', route: '/uam/role-details' }, 
      { title: 'Permissions', route: '/uam/permissions' }
    ] },
    groups: { title: 'Onboarding', items: [
      { title: 'Outlet', route: '/core/outlet-getAll' },
       { title: 'Staff', route: '/core/staff-onboarding-getAll' },
        { title: 'IAM', route: '/uam/users' }
      ] },
    rooms: { title: 'Rooms', items: [
      { title: 'Rooms', route: '/core/room-management' }, 
      { title: 'Floor', route: '/core/floors-management' },
      { title: 'Room Type', route: '/core/room-type-management' },
       { title: 'Beds', route: '/core/beds-management' },
       { title: 'Amenities', route: '/core/amenities-management' },
      
      ] },
    tenants: { title: 'Tenants', items: [
      { title: 'Tenants', route: '/core/tenant-management' }
    ] },

      menu: { title: 'Menu', items: [
      { title: 'Menu', route: '/core/menu' }
    ] },
    payments: { title: 'Payments', items: [
      { title: 'Payments', route: '/core/payment-management' }
    ] },
    maintenance: { title: 'Maintenance', items: [
      { title: 'Maintenance', route: '/core/maintenance-management' },
      { title: 'Category', route: '/core/maintenance-category' }
    ] },
    expenses: { title: 'Expenses', items: [
      { title: 'Expenses', route: '/core/expenses-management' },
       { title: 'Category', route: '/core/expenses-category' }
    ] }
  };

  isCollapsed = true;
  isMobile = false;
  private destroy$ = new Subject<void>();

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                         */
  /* ------------------------------------------------------------------ */
  @HostListener('window:resize') onResize(): void { this.checkScreenSize(); }

  constructor(private router: Router) {
    this.filterMenuByPrivileges();
    this.subscribeToRouterEvents();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    // Initialize selectedMenu based on current URL
    this.updateSelectedMenuFromUrl(this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    if (this.leaveTimeout) clearTimeout(this.leaveTimeout);
  }

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */
  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(e => this.updateSelectedMenuFromUrl(e.urlAfterRedirects));
  }

  private updateSelectedMenuFromUrl(url: string): void {
    if (url.startsWith('/core/outlet') || url.startsWith('/core/profile')) {
      this.selectedMenu = 'home';
    } else if (url.startsWith('/uam')) {
      this.selectedMenu = 'admin_panel_settings';
    } else if (url.startsWith('/core/staff') || url.includes('onboarding') || url.startsWith('/core/outlet-getAll')) {
      this.selectedMenu = 'groups';
    } else if (url.includes('room') || url.includes('floor') || url.includes('bed')) {
      this.selectedMenu = 'rooms';
    } else if (url.includes('tenant')) {
      this.selectedMenu = 'tenants';
    } else if (url.includes('payment')) {
      this.selectedMenu = 'payments';
    } else if (url.includes('maintenance')) {
      this.selectedMenu = 'maintenance';
    } else if (url.includes('expenses')) {
      this.selectedMenu = 'expenses';
    } else {
      this.selectedMenu = 'home'; // fallback
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true; // Ensure collapsed on mobile resize
    }
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /* ------------------------------------------------------------------ */
  /*  Hover handling                                                    */
  /* ------------------------------------------------------------------ */
  onMenuHover(menu: string, event: MouseEvent): void {
    if (this.isMobile) return;
    clearTimeout(this.hoverTimeout);
    clearTimeout(this.leaveTimeout);
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.submenuPosition = { left: rect.right, top: rect.top + window.scrollY };

    this.hoverTimeout = setTimeout(() => {
      if (this.hasMenuItems(menu)) this.hoveredMenu = menu;
    }, 100);
  }

  onMenuLeave(): void {
    if (this.isMobile) return;
    clearTimeout(this.hoverTimeout);
    this.leaveTimeout = setTimeout(() => this.hoveredMenu = null, 150);
  }

  keepSubmenuOpen(): void {
    clearTimeout(this.hoverTimeout);
    clearTimeout(this.leaveTimeout);
  }

  closeSubmenu(): void {
    this.isSubmenuHovered = false;
    this.closeTimeout = setTimeout(() => this.hoveredMenu = null, 100);
  }

  /* ------------------------------------------------------------------ */
  /*  Selection / navigation                                            */
  /* ------------------------------------------------------------------ */
  selectMenu(menu: string): void {
    // DO NOT set selectedMenu here — let router update it
    const route = this.filteredMenuConfig[menu]?.items[0]?.route;
    if (route) {
      this.router.navigate([route]).then(() => {
        // Optional: force update if navigation is same URL
        this.updateSelectedMenuFromUrl(this.router.url);
      });
    }
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  navigateToSubmenu(item: MenuItem): void {
    this.router.navigate([item.route]).then(() => {
      this.updateSelectedMenuFromUrl(this.router.url);
    });
    this.hoveredMenu = null;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Menu filtering (privileges)                                       */
  /* ------------------------------------------------------------------ */
  private filterMenuByPrivileges(): void {
    this.filteredMenuConfig = {};
    for (const key of Object.keys(this.menuConfig)) {
      const section = this.menuConfig[key];
      const filtered = section.items.filter(i => !i.privilege || this.privileges.includes(i.privilege));
      if (filtered.length) {
        this.filteredMenuConfig[key] = { ...section, items: filtered };
      }
    }
  }

  getSubmenuTitle(): string {
    return this.hoveredMenu ? this.filteredMenuConfig[this.hoveredMenu]?.title || '' : '';
  }

  getSubmenuItems(): MenuItem[] {
    return this.hoveredMenu ? this.filteredMenuConfig[this.hoveredMenu]?.items || [] : [];
  }

  hasMenuItems(menu: string): boolean {
    return !!this.filteredMenuConfig[menu]?.items?.length;
  }


}