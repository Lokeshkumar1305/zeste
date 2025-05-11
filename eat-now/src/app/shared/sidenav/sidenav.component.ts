import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ApiService } from '../../common-library/services/api.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  @ViewChild('sideMenu', { static: true }) private sideMenu!: MatSelectionList;
  sidenav!: MatSidenav;
  isMobile = true;

  constructor(private cdRef: ChangeDetectorRef, public postService: ApiService, private router: Router) { }
  step!: number;
  userName!: string;
  designation!: string;
  ngOnInit() {
    // this.step = Number(sessionStorage.getItem('step'))!;
    this.designation = 'Administrator';
    // Retrieve and format logged-in user's name from session storage
    // let loggedInUser = sessionStorage.getItem('loggedInUser')!
    let loggedInUser = "Eatnow@gmail.com"

    let lu: any = loggedInUser;
    if (lu) {
      lu = lu.split('@');
      lu = lu[0].replace('.', ' ');
      this.userName = lu;
    }
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.postService.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.postService.isCollapsed = !this.postService.isCollapsed;
    }
  }
  isMenuExpanded = false;
  toggleSideNav() {
    if (this.isMenuExpanded) {
      this.isMenuExpanded = false;
    } else {
      this.isMenuExpanded = true;
    }

  }

  /* Sets the current step index for a multi-step process.*/
  setStep(index: any) {
    this.step = index;
  }

  /* Logs the user out of the application.*/
  logout() {
    // sessionStorage.clear();
    this.router.navigate(['/']);
    // this.idleService.disableIdleDetection();
  }

 
activeIndex: number | null = null;
icons = [
  { name: 'home', tooltip: 'Home' },
  { name: 'groups', tooltip: 'Onboarding' },
  { name: 'list_alt', tooltip: 'Menu' },
  { name: 'table_restaurant', tooltip: 'Table' },
  { name: 'inventory', tooltip: 'Inventory' },
  { name: 'room_service', tooltip: 'Orders' },
  { name: 'chef_hat', tooltip: 'Kitchen' }
];


iconListData: { [key: string]: { title: string, items: { icon: string, title: string }[] } } = {
  home: {
    title: 'Home',
    items: [
      { icon: 'home', title: 'Dashboard' },
      { icon: 'account_circle', title: 'Profile' }
    ]
  },
  groups: {
    title: 'Onboarding',
    items: [
      { icon: 'person_add', title: 'Outlet' },
      { icon: 'group', title: 'Staff' }
    ]
  },
  list_alt: {
    title: 'Menu',
    items: [
      { icon: 'restaurant_menu', title: 'View Menu' },
      { icon: 'add', title: 'Add Item' }
    ]
  },
  table_restaurant: {
    title: 'Table',
    items: [
      { icon: 'event_seat', title: 'Table Map' },
      { icon: 'add', title: 'Add Table' }
    ]
  },
  inventory: {
    title: 'Inventory',
    items: [
      { icon: 'inventory_2', title: 'Stock' },
      { icon: 'add_shopping_cart', title: 'Order Supplies' }
    ]
  },
  room_service: {
    title: 'Orders',
    items: [
      { icon: 'room_service', title: 'Current Orders' },
      { icon: 'history', title: 'Order History' }
    ]
  },
  chef_hat: {
    title: 'Kitchen',
    items: [
      { icon: 'restaurant', title: 'Current Dishes' },
      { icon: 'schedule', title: 'Prep Schedule' }
    ]
  }
};

}
