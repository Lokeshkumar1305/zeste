import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

interface Notification {
  icon: string;
  color: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

  loggedInUser = '';
  userName = '';
  searchQuery = '';
  notificationCount = 0;
  profileCompletionPercentage = 76;

  // Theme state
  isDarkMode = false;
  themeColors: string[] = ['#1A365D', '#3B5A8C', '#2A69A6', '#8A4A9F', '#28A745', '#F39C12'];
  selectedColor = this.themeColors[0];

  notificationsList: Notification[] = [];

  constructor(
    private readonly router: Router,
    private readonly theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = sessionStorage.getItem('loggedInUser') || 'eatnow@gmail.com';
    this.extractUserName();
    this.loadNotifications();

    // Initialize theme from persisted state or system preference
     const state = this.theme.getState();
    this.isDarkMode = state.mode === 'dark';
    this.selectedColor = state.color;
    this.theme.init(); 

    // Apply selected color to document data attribute for dynamic styling
    document.documentElement.setAttribute('data-brand-color', this.selectedColor);


    const mode = document.documentElement.getAttribute('data-theme');
    this.isDarkMode = mode === 'dark';
  }

  // Alt + K focuses the search input
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.searchInput?.nativeElement?.focus();
    }
  }

  onSearch(): void {
    const term = (this.searchQuery || '').trim();
    if (!term) return;
    // Implement your search navigation or service call
    console.log('Searching for:', term);
  }

  psdChange(): void {
    this.router.navigate(['/core/change-password']);
  }

  goToProfile(): void {
    this.router.navigate(['/uam/user-profile/1']);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  markAllRead(): void {
    this.notificationCount = 0;
  }

  private extractUserName(): void {
    const lu = this.loggedInUser;
    if (lu) {
      this.userName = lu.split('@')[0].replace('.', ' ');
    }
  }

  private loadNotifications(): void {
    this.notificationsList = [
      {
        icon: 'check_circle',
        color: '#20C997',
        title: 'Leave Approved',
        description: 'Your leave request for Dec 20-22 has been approved',
        time: '2 hours ago'
      },
      {
        icon: 'event',
        color: '#5B4A9F',
        title: 'Meeting Reminder',
        description: 'Team sync scheduled at 3:00 PM today',
        time: '5 hours ago'
      },
      {
        icon: 'campaign',
        color: '#FF9800',
        title: 'New Announcement',
        description: 'Company holiday list for 2026 is now available',
        time: '1 day ago'
      }
    ];
    this.notificationCount = this.notificationsList.length;
  }

  // Theme actions
  onColorPick(color: string): void {
    this.selectedColor = color;
    this.theme.setBrandColor(color);
    document.documentElement.setAttribute('data-brand-color', color); // Update data attribute on color change
  }

  // onModeToggle(event: { checked: boolean }): void {
  //   this.isDarkMode = event.checked;
  //   this.theme.setMode(this.isDarkMode ? 'dark' : 'light');
  // }


  onModeToggle(ev: MatSlideToggleChange) {
    this.isDarkMode = ev.checked;
    this.theme.setMode(this.isDarkMode ? 'dark' : 'light');
  }

}