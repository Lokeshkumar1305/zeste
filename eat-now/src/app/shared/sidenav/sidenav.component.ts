import { Component, HostListener, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

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
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-15px) scale(0.95)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-10px) scale(0.95)' }))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggle = new EventEmitter<void>();

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
    
    if (!this.isMobile && wasMobile) {
      this.isCollapsed = false;
      this.toggle.emit();
    }
  }

  // ✅ Click outside to close floating card
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideSidenav = target.closest('.sidenav');
    const clickedInsideFloatingCard = target.closest('.floating-card');
    
    // If clicked outside and floating card is open, close it
    if (this.isCollapsed && this.openedGroup && !clickedInsideSidenav && !clickedInsideFloatingCard) {
      this.openedGroup = null;
    }
  }

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();
    
    if (this.isCollapsed) {
      this.openedGroup = null;
    }
  }

  toggleGroup(groupKey: string) {
    // Toggle the floating card
    if (this.openedGroup === groupKey) {
      this.openedGroup = null;
    } else {
      this.openedGroup = groupKey;
    }

    // Close mobile sidenav after selection (only if not collapsed)
    if (this.isMobile && !this.isCollapsed) {
      setTimeout(() => {
        this.isCollapsed = true;
        this.toggle.emit();
      }, 300);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    
    // Close floating card after navigation
    if (this.isCollapsed) {
      this.openedGroup = null;
    }
    
    // Close mobile menu
    if (this.isMobile) {
      this.isCollapsed = true;
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
      if (!this.isCollapsed) {
        this.openedGroup = null;
      }
      return;
    }

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

    if (!this.isCollapsed) {
      this.openedGroup = foundGroup;
    }
  }
}