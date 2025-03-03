import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../common-library/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router, public dialog: MatDialog, public postService: ApiService){ }
  loggedInUser: any;
  userName!: string;
  pwdExpiry: any;
  // notifyList: Array<notification> = [];
  noOfNotifications: any;
  clear: boolean = false;
  isHovered: any = null;
  isSticky: boolean = false;
  expiryNotification: any;
  text: any;
  @Output() emitSideMenu = new EventEmitter();
  ngOninIt(){
    // this.loggedInUser = sessionStorage.getItem('loggedInUser')!;
    this.loggedInUser = "eatnow@gmail.com"
    let lu: any = this.loggedInUser;
    if (lu) {
      lu = lu.split('@');
      lu = lu[0].replace('.', ' ');
      this.userName = lu;
    }
  }
  psdChange() {
    this.router.navigate(['/core/change-password'])
  }
  goToProfile() {
    this.router.navigate(['/uam/user-profile/' + 1])
  }
  /* method enhances user interface interaction by managing the side navigation state.*/
  toggleSideNav() {
    this.emitSideMenu.emit();
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
}
