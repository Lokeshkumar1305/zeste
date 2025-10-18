import { ChangeDetectorRef, Component, HostBinding, HostListener, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../common-library/services/api.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSelectionList } from '@angular/material/list';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
  selectedMenu: string = 'dashboard';
  privileges: string[] = [];
  filteredMenuConfig: { [key: string]: { title: string, items: any[] } } = {};

  menuConfig: { [key: string]: { title: string, items: any[] } } = {
    dashboard: {
      title: 'Dashboard',
      items: [
        { title: 'Case Dashboard', route: '/case-mgmt/case-dashboard', privilege: '_CASEMGMT_API_CASE_GETALL_POST' },
      ]
    },
    uam: {
      title: 'User Access Management',
      items: [
        { title: 'IAM', route: '/uam/users', privilege: '_CASEMGMT_API_USER_GETALL_POST' }
      ]
    },
    caseManagement: {
      title: 'Case Management',
      items: [
        { title: 'Cases', route: '/case-mgmt/cases', privilege: '_CASEMGMT_API_CASE_GETALL_POST' },
        { title: 'Create Field Config', route: '/case-mgmt/case-fields-config', privilege: '_CASEMGMT_API_CASE_CREATE_POST' },
        { title: 'Escalation Dashboard', route: '/case-mgmt/escalation', privilege: '_CASEMGMT_API_CASE_CREATE_POST' },
        { title: 'Escalation', route: '/case-mgmt/escalation-directory', privilege: '_CASEMGMT_API_CASE_CREATE_POST' },
      ]
    },
    administration: {
      title: 'Administration',
      items: [
        { title: 'Case Configuration', route: '/administration/manage-case-config/case-configuration', privilege: '_CASEMGMT_API_CASECONFIGURATION_POST' },
        { title: 'Case Type Configurations', route: '/administration/manage-case-config/case-type-configurations', privilege: '_CASEMGMT_API_CASETYPECONFIGURATION_POST' },
        { title: 'General Configurations', route: '/administration/config/general-configuration', privilege: '_CASEMGMT_API_CASETYPECONFIGURATION_POST' }
      ]
    }
  };

  isCollapsed = false;
  isMobile = false;
  tenantId: string | null = null; // Store tenantId

  // Dynamic host binding for CSS classes
  @HostBinding('class.dashboard-only') 
  get isDashboardOnly() {
    return this.selectedMenu === 'dashboard' || !this.hasMenuItems(this.selectedMenu);
  }

  @HostBinding('class.with-secondary') 
  get hasSecondary() {
    return this.selectedMenu !== 'dashboard' && this.hasMenuItems(this.selectedMenu);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  constructor(private router: Router,) {
    console.log('Sidenav Initial Privileges:', this.privileges);
    console.log('Sidenav Tenant ID:', this.tenantId);
    this.filterMenuByPrivileges();
    console.log('Sidenav Initial Filtered Menu Config:', this.filteredMenuConfig);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        console.log('Sidenav Navigation URL:', url);

        if (url.startsWith('/uam')) {
          this.selectedMenu = 'uam';
        } else if (url.startsWith('/administration')) {
          this.selectedMenu = 'administration';
        } else if (url.startsWith('/case-mgmt/case-dashboard')) {
          this.selectedMenu = 'dashboard';   
        } else if (url.startsWith('/case-mgmt')) {
          this.selectedMenu = 'caseManagement';
        } else {
          this.selectedMenu = 'dashboard';
        }

        console.log('Sidenav Selected Menu:', this.selectedMenu);
      });
  }

  ngOnInit(): void {
    this.checkScreenSize(); 
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleCollapse() {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
    console.log('Sidenav Menu Selected:', menu);
    
    // For dashboard, navigate to the dashboard route directly
    if (menu === 'dashboard') {
      console.log('Navigating to dashboard');
      this.router.navigate(['/case-mgmt/case-dashboard']);
    } else {
      // Navigate to the first item in the section if applicable
      const firstItemRoute = this.filteredMenuConfig[menu]?.items[0]?.route;
      if (firstItemRoute) {
        console.log('Navigating to:', firstItemRoute);
        this.router.navigate([firstItemRoute]);
      }
    }
  }

  filterMenuByPrivileges() {
    this.filteredMenuConfig = {};
    for (const key in this.menuConfig) {
      const section = this.menuConfig[key];
      let filteredItems = section.items.filter(item =>
        (!item.privilege || this.privileges.includes(item.privilege))
      );
      if (filteredItems.length > 0) {
        this.filteredMenuConfig[key] = {
          ...section,
          items: filteredItems
        };
      }
    }
  }

  getSidenavHeading(): string {
    if (this.selectedMenu === 'dashboard') return '';
    return this.filteredMenuConfig[this.selectedMenu]?.title || '';
  }

  hasMenuItems(menu: string): boolean {
    return !!this.filteredMenuConfig[menu]?.items && this.filteredMenuConfig[menu].items.length > 0;
  }

  navigate(item: any) {
    console.log('Navigating to:', item.route);
    this.router.navigate([item.route]);
  }
}
