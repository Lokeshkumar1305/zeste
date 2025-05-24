import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './common-library/services/api.service';
import { LoginService } from './auth/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eat-now';

  activeIndex: number = 0;
  activeListItemIndex: number | null = null;
  sidenavOpened: boolean = false;
  sidenavWidth: string = '260px';

  loggedInUser: string = '';
  userName: string = '';

  icons = [
    { name: 'home', tooltip: 'Home' },
    { name: 'admin_panel_settings', tooltip: 'IAM' },
    { name: 'groups', tooltip: 'Onboarding' },
    { name: 'list_alt', tooltip: 'Menu' },
    { name: 'table_restaurant', tooltip: 'Table' },
    { name: 'inventory', tooltip: 'Inventory' },
    { name: 'room_service', tooltip: 'Orders' },
    { name: 'chef_hat', tooltip: 'Kitchen' }
  ];

  iconListData: { [key: string]: { title: string, items: { icon: string; title: string; route: string }[] } } = {
    home: {
      title: 'Home',
      items: [
        { icon: 'home', title: 'Dashboard', route: '/core/outlet-onboarding' },
        { icon: 'account_circle', title: 'Profile', route: '/core/outlet-onboarding' }
      ]
    },
    admin_panel_settings: {
      title: 'IAM',
      items: [
        { icon: 'account_box', title: 'Users', route: '/uam/users' },
        { icon: 'security', title: 'Roles', route: '/uam/roles' }
      ]
    },
    groups: {
      title: 'Onboarding',
      items: [
        { icon: 'person_add', title: 'Outlet', route: '/core/outlet-getAll' },
        { icon: 'group', title: 'Staff', route: '/core/staff-onboarding-getAll' },
        { icon: 'home', title: 'IAM', route: '/uam/users' }
      ]
    },
    list_alt: {
      title: 'Menu',
      items: [
        { icon: 'restaurant_menu', title: 'View Menu', route: '/core/outlet-onboarding' },
        { icon: 'add', title: 'Add Item', route: '/core/outlet-onboarding' }
      ]
    },
    table_restaurant: {
      title: 'Table',
      items: [
        { icon: 'square', title: 'Area', route: '/core/area' },
        { icon: 'table_bar', title: 'Table', route: '/core/table' }
      ]
    },
    inventory: {
      title: 'Inventory',
      items: [
        { icon: 'inventory_2', title: 'Items', route: '/core/items' }, 
        { icon: 'shopping_cart', title: 'Purchase Orders', route: '/core/purchase-order' },
        { icon: 'local_shipping', title: 'Suppliers', route: '/core/supplier' },
        { icon: 'sync_alt', title: 'Stock Moment', route: '/core/stock-moment' }
      ]
      
    },
    room_service: {
      title: 'Orders',
      items: [
        { icon: 'room_service', title: 'Current Orders', route: '/core/outlet-onboarding' },
        { icon: 'history', title: 'Order History', route: '/core/outlet-onboarding' }
      ]
    },
    chef_hat: {
      title: 'Kitchen',
      items: [
        { icon: 'restaurant', title: 'Current Dishes', route: '/core/outlet-onboarding' },
        { icon: 'schedule', title: 'Prep Schedule', route: '/core/outlet-onboarding' }
      ]
    }
  };

  constructor(
    public loginService: LoginService,
    private router: Router,
    public snackbar: MatSnackBar,
    public postService: ApiService
  ) { }

  ngOnInit() {
    // Example: fetch user info from session or service
    this.loggedInUser = "eatnow@gmail.com";
    const lu = this.loggedInUser.split('@')[0].replace('.', ' ');
    this.userName = lu;

    // Default to Home
    this.activeIndex = 0;
    this.sidenavOpened = false;
    this.navigateTo(this.iconListData[this.icons[0].name].items[0].route);
  }

  logout() {
    sessionStorage.clear();
    // Add additional logout logic if needed
    // this.router.navigate(['/']);
  }

  psdChange() {
    this.router.navigate(['/core/change-password']);
  }

  goToProfile() {
    this.router.navigate(['/uam/user-profile/' + 1]);
  }

  onIconClick(index: number) {
    this.activeIndex = index;

    if (index === 0) {
      this.sidenavOpened = false;
      this.activeListItemIndex = null;
      this.navigateTo(this.iconListData[this.icons[0].name].items[0].route);
    } else {
      this.sidenavOpened = true;
      this.activeListItemIndex = 0;

      const iconKey = this.icons[index].name;
      const firstItemRoute = this.iconListData[iconKey].items[0].route;
      this.navigateTo(firstItemRoute);
    }
  }


  navigateTo(route: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
