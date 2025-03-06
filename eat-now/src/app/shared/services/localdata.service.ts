import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaldataService {
  DBEnumUrl = './assets/db.json';


  constructor(private http: HttpClient) { }
  getDBEnum(): Observable<any[]> {
    return this.http.get<any[]>(this.DBEnumUrl);
  }
}
