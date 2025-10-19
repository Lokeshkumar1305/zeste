import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { BreadcrumbItem, BreadcrumbLabel, BreadcrumbConfig } from '../../common-library/breadcrum.modal';


@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<BreadcrumbItem[]>([]);
  readonly breadcrumbs = this._breadcrumbs$.asObservable();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.build(this.router.routerState.snapshot.root))
      )
      .subscribe(list => this._breadcrumbs$.next(list));
  }

  private build(snapshot: ActivatedRouteSnapshot): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [];
    let url = '';

    const walk = (node: ActivatedRouteSnapshot | null): void => {
      if (!node) return;

      // Compute this node's URL contribution
      const segment = node.url.map(s => s.path).join('/');
      if (segment) {
        url += `/${segment}`;
      }

      // Resolve breadcrumb data (string | function | config | false)
      const data = node.data?.['breadcrumb'] as BreadcrumbLabel | BreadcrumbConfig | boolean | undefined;

      if (data !== false) {
        let label: string | null = null;
        let icon: string | undefined;

        if (typeof data === 'string' || typeof data === 'function') {
          label = this.resolveLabel(data, node);
        } else if (data && typeof data === 'object') {
          if (!data.skip) {
            label = this.resolveLabel(data.label, node);
            icon = data.icon;
          }
        }

        // Fallbacks if no explicit breadcrumb label
        if (!label) {
          label =
            (node.data?.['title'] as string) ??
            node.title ??
            node.routeConfig?.path ??
            '';
        }

        if (label) {
          crumbs.push({ label, url, icon });
        }
      }

      // Continue down the primary outlet chain
      walk(node.firstChild ?? null);
    };

    walk(snapshot.firstChild ?? null);

    if (crumbs.length) {
      crumbs[crumbs.length - 1].isLast = true;
    }

    return crumbs;
  }

  private resolveLabel(label: BreadcrumbLabel, node: ActivatedRouteSnapshot): string {
    return typeof label === 'function' ? label(node) : label;
  }
}