import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginObj = new Login();
  inProgressBar = false;
  hidePwd = true;
  login(username: string, password: string) {
    this.inProgressBar = true;
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