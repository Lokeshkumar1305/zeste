import { Injectable } from '@angular/core';
import { Announcement, AnnouncementFilter, AnnouncementType, Priority, TargetAudience } from '../../common-library/model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
private apiUrl = '/api/announcements';
  
  // Mock data for demonstration
  private mockAnnouncements: Announcement[] = [
    {
      id: 1,
      title: 'Water Supply Interruption',
      message: 'Water supply will be interrupted on 15th Dec from 10 AM to 2 PM due to tank cleaning. Please store water accordingly.',
      type: AnnouncementType.MAINTENANCE,
      priority: Priority.HIGH,
      targetAudience: TargetAudience.ALL,
      createdAt: new Date('2024-12-10'),
      isActive: true,
      createdBy: 'Admin',
      expiryDate: new Date('2024-12-16')
    },
    {
      id: 2,
      title: 'Rent Payment Reminder',
      message: 'Kindly pay your rent before 5th of every month to avoid late fees. Payment can be made via UPI, Bank Transfer, or Cash.',
      type: AnnouncementType.PAYMENT,
      priority: Priority.MEDIUM,
      targetAudience: TargetAudience.ALL,
      createdAt: new Date('2024-12-01'),
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 3,
      title: 'Christmas Party',
      message: 'Join us for a Christmas celebration on 25th December at 7 PM in the common hall. Snacks and games will be arranged!',
      type: AnnouncementType.EVENT,
      priority: Priority.LOW,
      targetAudience: TargetAudience.ALL,
      createdAt: new Date('2024-12-08'),
      isActive: true,
      createdBy: 'Admin',
      expiryDate: new Date('2024-12-26')
    },
    {
      id: 4,
      title: 'WiFi Maintenance',
      message: 'WiFi will be unavailable on 12th Dec from 11 PM to 6 AM for router upgrade.',
      type: AnnouncementType.MAINTENANCE,
      priority: Priority.MEDIUM,
      targetAudience: TargetAudience.ALL,
      createdAt: new Date('2024-12-09'),
      isActive: false,
      createdBy: 'Admin'
    },
    {
      id: 5,
      title: 'New Hostel Rules',
      message: 'Please note the updated hostel rules effective from January 2025. Check the notice board for details.',
      type: AnnouncementType.RULES,
      priority: Priority.HIGH,
      targetAudience: TargetAudience.ALL,
      createdAt: new Date('2024-12-05'),
      isActive: true,
      createdBy: 'Admin'
    }
  ];

  private announcementsSubject = new BehaviorSubject<Announcement[]>(this.mockAnnouncements);
  public announcements$ = this.announcementsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAnnouncements(filter?: AnnouncementFilter): Observable<Announcement[]> {
    // Simulating API call with mock data
    let filtered = [...this.mockAnnouncements];
    
    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(a => a.type === filter.type);
      }
      if (filter.priority) {
        filtered = filtered.filter(a => a.priority === filter.priority);
      }
      if (filter.isActive !== undefined) {
        filtered = filtered.filter(a => a.isActive === filter.isActive);
      }
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(term) || 
          a.message.toLowerCase().includes(term)
        );
      }
    }
    
    return of(filtered).pipe(delay(300));
  }

  getAnnouncementById(id: number): Observable<Announcement | undefined> {
    return of(this.mockAnnouncements.find(a => a.id === id)).pipe(delay(200));
  }

  createAnnouncement(announcement: Partial<Announcement>): Observable<Announcement> {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Math.max(...this.mockAnnouncements.map(a => a.id)) + 1,
      createdAt: new Date(),
      isActive: true,
      createdBy: 'Admin'
    } as Announcement;
    
    this.mockAnnouncements.unshift(newAnnouncement);
    this.announcementsSubject.next(this.mockAnnouncements);
    
    return of(newAnnouncement).pipe(delay(500));
  }

  updateAnnouncement(id: number, announcement: Partial<Announcement>): Observable<Announcement> {
    const index = this.mockAnnouncements.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAnnouncements[index] = {
        ...this.mockAnnouncements[index],
        ...announcement,
        updatedAt: new Date()
      };
      this.announcementsSubject.next(this.mockAnnouncements);
      return of(this.mockAnnouncements[index]).pipe(delay(500));
    }
    throw new Error('Announcement not found');
  }

  deleteAnnouncement(id: number): Observable<boolean> {
    const index = this.mockAnnouncements.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAnnouncements.splice(index, 1);
      this.announcementsSubject.next(this.mockAnnouncements);
      return of(true).pipe(delay(300));
    }
    return of(false);
  }

  toggleAnnouncementStatus(id: number): Observable<Announcement> {
    const announcement = this.mockAnnouncements.find(a => a.id === id);
    if (announcement) {
      announcement.isActive = !announcement.isActive;
      announcement.updatedAt = new Date();
      this.announcementsSubject.next(this.mockAnnouncements);
      return of(announcement).pipe(delay(300));
    }
    throw new Error('Announcement not found');
  }

  getRooms(): Observable<string[]> {
    return of(['101', '102', '103', '201', '202', '203', '301', '302', '303']).pipe(delay(200));
  }

  getFloors(): Observable<string[]> {
    return of(['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor']).pipe(delay(200));
  }
}