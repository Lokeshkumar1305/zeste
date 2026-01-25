import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApiService } from './common-library/services/api.service';
import { LoginService } from './auth/login.service';
import { ThemeService } from './shared/services/theme.service';
import { LayoutService } from './shared/services/layout.service';

import { TranslateService } from '@ngx-translate/core';

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

  // Screen size flags
  isMobile = false;
  isTablet = false;

  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  private destroy$ = new Subject<void>();

  constructor(
    public loginService: LoginService,
    private router: Router,
    public snackbar: MatSnackBar,
    public postService: ApiService,
    private theme: ThemeService,
    public layout: LayoutService,
    private translate: TranslateService
  ) {
    // Internationalization Init
    this.translate.addLangs(['en', 'hi']);
    this.translate.setDefaultLang('en');

    const savedLang = localStorage.getItem('app-lang');
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      this.translate.use('en');
    }
  }

  ngOnInit(): void {
    this.initializeUser();
    this.initializeTheme();
    this.checkScreenSize();          // sets initial sidebarCollapsed
    this.subscribeToLayoutChanges(); // sync from LayoutService
    this.subscribeToRouteChanges();  // mobile auto-close
    this.updateLayoutClasses();      // ensure body classes are correct
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  // -------- init helpers --------
  private initializeUser(): void {
    this.loggedInUser =
      sessionStorage.getItem('loggedInUser') || 'eatnow@gmail.com';
    this.userName = this.formatUserName(this.loggedInUser);
  }

  private initializeTheme(): void {
    this.theme.init();
  }

  private formatUserName(email: string): string {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  // -------- responsive layout: MOBILE/TABLET/DESKTOP --------
  /**
   * Rules:
   * - MOBILE  (< 768):  sidenav collapsed (overlay)
   * - TABLET  (768–1023): sidenav collapsed (icon rail)
   * - DESKTOP (>= 1024): sidenav expanded
   */
  private checkScreenSize(): void {
    const width = window.innerWidth;

    this.isMobile = width < this.MOBILE_BREAKPOINT;
    this.isTablet =
      width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;

    const shouldBeCollapsed = this.isMobile || this.isTablet;

    if (shouldBeCollapsed !== this.sidebarCollapsed) {
      this.sidebarCollapsed = shouldBeCollapsed;
      this.layout.setCollapsed(this.sidebarCollapsed);
      this.updateLayoutClasses();
    }
  }

  /** Add/remove classes on <body> so header can align with sidenav */
  private updateLayoutClasses(): void {
    const body = document.body;
    body.classList.toggle('nav-collapsed', this.sidebarCollapsed);
    body.classList.toggle('nav-expanded', !this.sidebarCollapsed);
  }

  // -------- subscriptions --------
  private subscribeToLayoutChanges(): void {
    this.layout.collapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => {
        this.sidebarCollapsed = collapsed;
        this.updateLayoutClasses();
      });
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Auto-close only on mobile after navigation
        if (this.isMobile && !this.sidebarCollapsed) {
          this.sidebarCollapsed = true;
          this.layout.setCollapsed(true);
          this.updateLayoutClasses();
        }
      });
  }

  // -------- sidebar API for children --------
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.layout.setCollapsed(this.sidebarCollapsed);
    this.updateLayoutClasses();
  }

  onSidebarToggle(): void {
    this.toggleSidebar();
  }

  // -------- navigation helpers --------
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

  psdChange(): void {
    this.router.navigate(['/core/change-password']);
  }

  goToProfile(): void {
    this.router.navigate(['/uam/user-profile/1']);
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  get isAuthenticated(): boolean {
    return this.loginService.isLoggedIn();
  }
}