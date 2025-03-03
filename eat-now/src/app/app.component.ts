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
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  menuState: string = 'out';


  constructor(public loginService: LoginService,
    private router: Router, public snackbar: MatSnackBar, public postService: ApiService){}
  title = 'eat-now';
  toggleMenu() {
    this.postService.isCollapsed = !this.postService.isCollapsed;
    if (this.postService.isCollapsed) {
      this.menuState = 'out';
    } else {
      this.menuState = 'in';
    }
  }
}
