import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { BreadcrumbItem } from '../../common-library/breadcrum.modal';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  
  readonly breadcrumbs: Observable<BreadcrumbItem[]> = this.breadcrumbsSubject.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initializeBreadcrumbs();
  }

  /**
   * Initialize breadcrumb tracking
   */
  private initializeBreadcrumbs(): void {
    // Build initial breadcrumbs
    this.buildBreadcrumbs();

    // Subscribe to navigation events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }

  /**
   * Build breadcrumbs from route
   */
  private buildBreadcrumbs(): void {
    const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * Recursively create breadcrumbs from route
   */
  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      const icon = child.snapshot.data['icon'];

      if (label) {
        breadcrumbs.push({
          label,
          url,
          icon
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  /**
   * Get current breadcrumbs
   */
  getCurrentBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbsSubject.value;
  }

  /**
   * Get current page title (last breadcrumb)
   */
  getCurrentPageTitle(): string {
    const breadcrumbs = this.breadcrumbsSubject.value;
    if (breadcrumbs.length > 0) {
      return breadcrumbs[breadcrumbs.length - 1].label;
    }
    return '';
  }

  /**
   * Manually set breadcrumbs (for custom pages)
   */
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * Add a breadcrumb
   */
  addBreadcrumb(breadcrumb: BreadcrumbItem): void {
    const current = this.breadcrumbsSubject.value;
    this.breadcrumbsSubject.next([...current, breadcrumb]);
  }

  /**
   * Remove last breadcrumb
   */
  removeLastBreadcrumb(): void {
    const current = this.breadcrumbsSubject.value;
    if (current.length > 0) {
      this.breadcrumbsSubject.next(current.slice(0, -1));
    }
  }

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.breadcrumbsSubject.next([]);
  }
}