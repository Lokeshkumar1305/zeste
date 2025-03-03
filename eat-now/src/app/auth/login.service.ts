import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }
  isUserLoggedIn() {
    // Check if either a temporary token or an authentication token is present in sessionStorage
    // if (sessionStorage.getItem('tempToken') || sessionStorage.getItem('token')) {
    //   return true;
    // }
    // return false;
  }
}
