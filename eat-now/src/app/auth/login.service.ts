import { Injectable } from '@angular/core';
import { APIPath } from '../common-library/api-enum';
import { Observable, catchError } from 'rxjs';
import { ApiService } from '../common-library/services/api.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedIn: any;

  constructor(public ApiService: ApiService, private http: HttpClient,) { }
  isUserLoggedIn() {
    // Check if either a temporary token or an authentication token is present in sessionStorage
    if (sessionStorage.getItem('tempToken')) {
      return true;
    }
    return false;
  }
  public doPostAuth(endPath: APIPath, obj: any): Observable<any> {
    const apiURL = this.ApiService.getBaseURL() + endPath;
    // Define HTTP headers for the request
    const httpOptions = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(`${apiURL}`, JSON.stringify(obj), { headers: httpOptions, observe: 'response' }).pipe(catchError(async (err) => this.handleError(err)))
  }
  public handleError(err: HttpErrorResponse) {
    if (err.status === 401) {
      // this.postService.openSnackBar('Invalid Credentials.', 'ERROR');
    }
  }
}
