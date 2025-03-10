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

  sidenavWidth: string = '270px';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  toggleSidenav() {
    if (this.sidenavWidth === '270px') {
      this.sidenavWidth = '80px'; // Change to 100px when toggled
    } else {
      this.sidenavWidth = '270px'; // Change back to 250px when toggled
    }
  }
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
  }
}
