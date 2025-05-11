import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { APIPath } from '../api-enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public isCollapsed = true;
  private onlineStatus: boolean = navigator.onLine;
  
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone,
    // public idleService: IdleService
  ) {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(isOnline: boolean) {
    this.ngZone.run(() => {
      this.onlineStatus = isOnline;
    });
  }

  isOnline(): boolean {
    return this.onlineStatus;
  }

 

  private createHttpOptions(withAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    if (withAuth) {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  public getBaseURL(): string {
    const baseUrl = window.location.href.split('/#/')[0];
    if (baseUrl.includes('localhost')) {
      if (baseUrl.endsWith('4200') || baseUrl.endsWith('4300')) {
        return 'http://192.168.1.5:8085';
      }
      if (baseUrl.endsWith('4500') || baseUrl.endsWith('4600')) {
        return 'https://cards-qa.toucanint.com/toucan';
      }
    }
    if (baseUrl.startsWith('http://192.168.1.5:8085') || baseUrl.startsWith('https://cust-onb-dev.toucanint.com')) {
      return 'https://cards-dev.toucanint.com/toucan';
    }
    if (baseUrl.startsWith('https://cards-qa.toucanint.com') || baseUrl.startsWith('https://cust-onb-qa.toucanint.com')) {
      return 'https://cards-qa.toucanint.com/toucan';
    }
    return baseUrl; // Fallback
  }

  public doPostGetWithoutToken(endPath: string): Observable<any> {
    const apiURL = this.getBaseURL() + endPath;
    return this.http.get(apiURL, { headers: this.createHttpOptions() });
  }

  public doPostWithOutToken(endPath: APIPath, obj: any): Observable<any> {
    const apiURL = this.getBaseURL() + endPath;
    return this.http.post(apiURL, JSON.stringify(obj), { headers: this.createHttpOptions() })
      .pipe(catchError(err => this.handleError(err, endPath, obj)));
  }

  public doPostGet(endPath: string): Observable<any> {
    const apiURL = this.getBaseURL() + endPath;
    return this.http.get(apiURL, { headers: this.createHttpOptions(true) });
  }

  public downloadFile(endPath: APIPath, filePath: any): Observable<Blob> {
    const apiURL = this.getBaseURL() + endPath;
    const httpOptions = {
      headers: this.createHttpOptions(true).set('Accept', '*/*'),
      responseType: 'blob' as 'json'
    };
    return this.http.post(apiURL, filePath, httpOptions) as Observable<Blob>;
  }

  public doPost(endPath: APIPath, obj: any): Observable<any> {
    if (!this.isOnline()) {
      this.snackBar.open('You are offline. Please check your internet connection.', 'Close', { duration: 3000 });
      return of({ error: 'You are offline. Please check your internet connection.' });
    }

    const apiURL = this.getBaseURL() + endPath;
    return this.http.post(apiURL, JSON.stringify(obj), { headers: this.createHttpOptions(true) })
      .pipe(catchError(err => this.handleError(err, endPath, obj)));
  }

 

  doPostParams(endPath: APIPath, formData: FormData): Observable<any> {
    let token: string;
    token = sessionStorage.getItem('token')!;
    token = 'Bearer ' + token;
    const apiURL = this.getBaseURL() + endPath;
    const baseUrl = window.location.href.split('/#/')[0];
    let httpOptions = new HttpHeaders();
    if (baseUrl.includes('localhost')) {
      httpOptions = new HttpHeaders({ Authorization: token });
    } else {
      httpOptions = new HttpHeaders({ Authorization: token });
    }
    return this.http.post(`${apiURL}`, formData, { headers: httpOptions }).pipe(catchError(err => this.handleError(err, endPath, formData)))
  }

  public handleError(httpErrorResponse: HttpErrorResponse, endPath: APIPath, obj: any): Observable<any> {
    if (httpErrorResponse.status === 401) {
      return this.refreshToken(APIPath.REFRESH_TOKEN).pipe(
        switchMap((response) => {
          if (response.success) {
            sessionStorage.setItem('token', response.token);
            return this.doPost(endPath, obj);
          } else {
            return throwError(() => new Error('refresh token generation failed.'));
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleTokenRefreshError(error);
          return throwError(() => new Error('refresh token generation failed.'));
        })
      );
    } else {
      this.router.navigate(['/error/' + httpErrorResponse.status]);
    }
    return throwError(() => new Error(httpErrorResponse.message));
  }

  private handleTokenRefreshError(error: HttpErrorResponse) {
    if (error.status === 498 || error.status === 0) {
      this.openSnackBar('Your session has expired. Please log in again.', 'ERROR');
    }
  }

  public openSnackBar(message: string, type: string, duration: number = 2500, vPosition: any = 'bottom', hPosition: any = 'center') {
    const config = new MatSnackBarConfig();
    config.politeness = 'assertive';
    config.duration = duration;
    config.horizontalPosition = hPosition;
    config.verticalPosition = vPosition;
    config.panelClass = this.getSnackBarClass(type);
    this.snackBar.open(message, 'x', config);
  }

  private getSnackBarClass(type: string): string[] {
    switch (type) {
      case 'SUCCESS': return ['snackBar-success'];
      case 'ERROR': return ['snackBar-error'];
      case 'WARN': return ['snackBar-warn'];
      case 'INFO': return ['snackBar-info'];
      case 'NOTIFICATION': return ['snackBar-notification'];
      default: return [];
    }
  }

 

  public closeNotification() {
    this.snackBar.dismiss();
  }

  public refreshToken(endPath: string): Observable<any> {
    const refreshToken = sessionStorage.getItem('refresh-token')!;
    const apiURL = this.getBaseURL() + endPath;
    const httpOptions = this.createHttpOptions(true).set('X-Api-Key', refreshToken);
    return this.http.get(apiURL, { headers: httpOptions });
  }

}
