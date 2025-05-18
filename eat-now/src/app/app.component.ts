import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from './common-library/services/api.service';
import { LoginService } from './auth/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class AppComponent {
  constructor(public loginService: LoginService,
    private router: Router, public snackbar: MatSnackBar, public postService: ApiService) { }
  title = 'eat-now';
  logout() {
    // this.postService.refreshToken(APIPath.USER_LOGOUT).subscribe(
    //   (response) => {
    //     if (response.success) {
    //       sessionStorage.clear();
    //       this.router.navigate(['/']);
    //       this.idleService.disableIdleDetection();
    //       this.postService.closeNotification();
    //     }
    //     else {
    //       this.postService.openSnackBar(response?.message, 'ERROR');
    //     }
    //   },
    //   // Error handler when an HTTP error occurs
    //   (error: HttpErrorResponse) => {
    //     if (error?.error.error) {
    //       this.postService.openSnackBar(error?.error.error, 'ERROR');
    //     } else {
    //       this.postService.openSnackBar(error?.error.message, 'ERROR');
    //     }
    //   });
    sessionStorage.clear();
    // this.router.navigate(['/']);
    // this.idleService.disableIdleDetection();
    // this.postService.closeNotification();
  }
  psdChange() {
    this.router.navigate(['/core/change-password'])
  }
  goToProfile() {
    this.router.navigate(['/uam/user-profile/' + 1])
  }
  loggedInUser: any;
  userName!: string;
  ngOninIt() {
    // this.loggedInUser = sessionStorage.getItem('loggedInUser')!;
    this.loggedInUser = "eatnow@gmail.com"
    let lu: any = this.loggedInUser;
    if (lu) {
      lu = lu.split('@');
      lu = lu[0].replace('.', ' ');
      this.userName = lu;
    }
    this.activeIndex = 0;
    this.sidenavOpened = false;
    this.navigateTo(this.iconListData[this.icons[0].name].items[0].route);
  }

  activeIndex: number = 0; // Default to Home
  activeListItemIndex: number | null = null;
  sidenavOpened: boolean = false; // Control sidenav open state


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
        { icon: 'home', title: 'IAM', route: '/uam/users' },

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
        { icon: 'inventory_2', title: 'Stock', route: '/core/outlet-onboarding' },
        { icon: 'add_shopping_cart', title: 'Order Supplies', route: '/core/outlet-onboarding' }
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
  navigateTo(route: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }
  onIconClick(index: number) {
    this.activeIndex = index;
    this.activeListItemIndex = null; // Reset list selection

    if (index === 0) {
      // Home: close sidenav and navigate to home
      this.sidenavOpened = false;
      this.navigateTo(this.iconListData[this.icons[0].name].items[0].route);
    } else {
      // Other: open sidenav, do NOT navigate
      this.sidenavOpened = true;
    }
  }

}


