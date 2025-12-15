import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, map, startWith } from 'rxjs/operators';
import { BreadcrumbItem } from '../../common-library/breadcrum.modal';
import { BreadcrumbService } from '../../shared/services/breadcrum.service';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() sidebarCollapsed = false;

  // Screen size
  isMobile = false;
  isTablet = false;

  // Breadcrumbs observable
  readonly breadcrumbs$: Observable<BreadcrumbItem[]>;

  // Current page title (last breadcrumb)
  currentPageTitle = '';

  // Breakpoints
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs;
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.subscribeToRouteChanges();
    this.subscribeToBreadcrumbs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle window resize
   */
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  /**
   * Check screen size
   */
  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < this.MOBILE_BREAKPOINT;
    this.isTablet = width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;
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
        // Route changed - breadcrumbs will update automatically
      });
  }

  /**
   * Subscribe to breadcrumbs for current page title
   */
  private subscribeToBreadcrumbs(): void {
    this.breadcrumbs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(breadcrumbs => {
        if (breadcrumbs && breadcrumbs.length > 0) {
          this.currentPageTitle = breadcrumbs[breadcrumbs.length - 1].label;
        }
      });
  }

  /**
   * TrackBy function for breadcrumb items
   */
  trackByUrl(index: number, item: BreadcrumbItem): string {
    return item.url;
  }

  /**
   * Navigate to breadcrumb
   */
  navigateTo(url: string): void {
    if (url) {
      this.router.navigate([url]);
    }
  }

  /**
   * Check if breadcrumb should be shown (responsive)
   * On mobile, only show last 2 breadcrumbs
   */
  shouldShowBreadcrumb(index: number, total: number): boolean {
    if (!this.isMobile) {
      return true;
    }
    // On mobile, show only last 2 breadcrumbs
    return index >= total - 2;
  }

  /**
   * Get truncated label for mobile
   */
  getTruncatedLabel(label: string, maxLength: number = 20): string {
    if (!this.isMobile || label.length <= maxLength) {
      return label;
    }
    return label.substring(0, maxLength) + '...';
  }

  /**
   * Check if this is the first visible breadcrumb (for showing ellipsis)
   */
  isFirstVisible(index: number, total: number): boolean {
    if (!this.isMobile) {
      return index === 0;
    }
    return index === total - 2 && total > 2;
  }
}