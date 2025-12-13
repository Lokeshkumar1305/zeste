import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostelService {


  constructor(private http: HttpClient) {}

  saveDraft(data: any): Observable<any> {
    // Save to localStorage for now (can be replaced with API call)
    localStorage.setItem('hostel_onboarding_draft', JSON.stringify(data));
    return of({ success: true });
    
    // API call:
    // return this.http.post(`${this.apiUrl}/hostel/onboarding/draft`, data);
  }

  getDraft(): Observable<any> {
    const draft = localStorage.getItem('hostel_onboarding_draft');
    return of(draft ? JSON.parse(draft) : null);
    
    // API call:
    // return this.http.get(`${this.apiUrl}/hostel/onboarding/draft`);
  }

  // submitOnboarding(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/hostel/onboarding/submit`, formData);
  // }

  // getOnboardingStatus(id: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/hostel/onboarding/status/${id}`);
  // }

  
}

