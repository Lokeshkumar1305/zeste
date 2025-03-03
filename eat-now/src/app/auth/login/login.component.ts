import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router){  } 
  loginObj = new Login();
  inProgressBar = false;
  hidePwd = true;
  localLogin(username: string, password: string) {
    this.inProgressBar = true;
    debugger
    if (username == 'sadmin' && password == 'Password@123') {
      sessionStorage.setItem('tempToken', 'tou123');
      // this.postService.openSnackBar('Logged In  Successfully', 'SUCCESS');
      this.router.navigate(['/Home']);
    } else {
      this.inProgressBar = false;
      // this.reqFS = true;
    }
  }
  login(username: string, password: string) {
    if (username === 'sadmin') {
      this.localLogin(username, password);
    }
    
  }
  forgotpass(){

  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /* Restricts input to numeric values only. */
  keyInputHandler(event: any) {
    const pattern = new RegExp('^[0-9]+$');
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  // DisableCut prevents the default cut action
  DisableCut(event: any) {
    event.preventDefault();
  }
  // DisableCopy prevents the default copy action
  DisableCopy(event: any) {
    event.preventDefault();
  }

  // DisablePaste prevents the default paste action
  DisablePaste(event: any) {
    event.preventDefault();
  }
  // DisableAuto prevents any default auto-processing 
  DisableAuto(event: any) {
    event.preventDefault();
  }
}
export class Login{
  userName!: string;
  password!: string;
}