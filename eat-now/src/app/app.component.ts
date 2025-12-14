import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApiService } from './common-library/services/api.service';
import { LoginService } from './auth/login.service';
import { ThemeService } from './shared/services/theme.service';
import { LayoutService } from './shared/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'zeste';

  // Sidebar state
  sidebarCollapsed = false;
  
  // User info
  loggedInUser = '';
  userName = '';

  // Screen size tracking
  isMobile = false;
  isTablet = false;

  // Breakpoints
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  private destroy$ = new Subject<void>();

  constructor(
    public loginService: LoginService,
    private router: Router,
    public snackbar: MatSnackBar,
    public postService: ApiService,
    private theme: ThemeService,
    public layout: LayoutService
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.initializeTheme();
    this.checkScreenSize();
    this.subscribeToLayoutChanges();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  /**
   * Initialize user information
   */
  private initializeUser(): void {
    this.loggedInUser = sessionStorage.getItem('loggedInUser') || 'eatnow@gmail.com';
    this.userName = this.formatUserName(this.loggedInUser);
  }

  /**
   * Initialize theme settings
   */
  private initializeTheme(): void {
    this.theme.init();
  }

  /**
   * Check and set screen size flags
   */
  private checkScreenSize(): void {
    const width = window.innerWidth;
    const wasMobile = this.isMobile;
    
    this.isMobile = width < this.MOBILE_BREAKPOINT;
    this.isTablet = width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;

    // Auto-collapse on mobile/tablet
    if ((this.isMobile || this.isTablet) && !wasMobile) {
      this.sidebarCollapsed = true;
      this.layout.setCollapsed(true);
    }

    // Auto-expand on desktop (if coming from mobile/tablet)
    if (!this.isMobile && !this.isTablet && wasMobile) {
      this.sidebarCollapsed = false;
      this.layout.setCollapsed(false);
    }
  }

  /**
   * Subscribe to layout service changes
   */
  private subscribeToLayoutChanges(): void {
    this.layout.collapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => {
        this.sidebarCollapsed = collapsed;
      });
  }

  /**
   * Subscribe to route changes
   */
  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Close sidebar on mobile after navigation
        if (this.isMobile && !this.sidebarCollapsed) {
          this.sidebarCollapsed = true;
          this.layout.setCollapsed(true);
        }
      });
  }

  /**
   * Format username from email
   */
  private formatUserName(email: string): string {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Toggle sidebar state - FIXED: This is the method called from template
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.layout.setCollapsed(this.sidebarCollapsed);
  }

  /**
   * Handle sidebar toggle from child components - FIXED: Added this method
   */
  onSidebarToggle(): void {
    this.toggleSidebar();
  }

  /**
   * Logout user
   */
  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    this.snackbar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Navigate to password change
   */
  psdChange(): void {
    this.router.navigate(['/core/change-password']);
  }

  /**
   * Navigate to user profile
   */
  goToProfile(): void {
    this.router.navigate(['/uam/user-profile/1']);
  }

  /**
   * Navigate to a route
   */
  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    return this.loginService.isLoggedIn();
  }
}