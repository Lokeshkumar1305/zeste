import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../common-library/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
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

  /* Sets the current step index for a multi-step process.*/
  setStep(index: any) {
    this.step = index;
  }

  /* Logs the user out of the application.*/
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
    // this.idleService.disableIdleDetection();
  }

  getPrivilege(api: any) {
  //  return this.postService.getPrivilege(api);
  }
}
