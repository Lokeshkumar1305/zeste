import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './common-library/services/api.service';
import { LoginService } from './auth/login.service';
import { ThemeService } from './shared/services/theme.service';
import { LayoutService } from './shared/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zeste';

  activeIndex: number = 0;
  activeListItemIndex: number | null = null;
  sidenavOpened: boolean = false;
  sidenavWidth: string = '260px';

  loggedInUser: string = '';
  userName: string = '';

  sidebarCollapsed = false;
 

  constructor(
    public loginService: LoginService,
    private router: Router,
    public snackbar: MatSnackBar,
    public postService: ApiService,
    private theme: ThemeService,
    public layout: LayoutService
  ) { }

  ngOnInit() {

    this.layout.collapsed$.subscribe(collapsed => {
    document.body.classList.toggle('sidenav-collapsed', collapsed);
  });
    // Example: fetch user info from session or service
    this.loggedInUser = "eatnow@gmail.com";
    const lu = this.loggedInUser.split('@')[0].replace('.', ' ');
    this.userName = lu
     this.theme.init();
  }



  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    sessionStorage.clear();
  }

  psdChange() {
    this.router.navigate(['/core/change-password']);
  }

  goToProfile() {
    this.router.navigate(['/uam/user-profile/' + 1]);
  }

  navigateTo(route: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
