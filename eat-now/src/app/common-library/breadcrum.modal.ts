import { ActivatedRouteSnapshot } from '@angular/router';

export type BreadcrumbLabel = string | ((route: ActivatedRouteSnapshot) => string);

export interface BreadcrumbConfig {
  label: BreadcrumbLabel;
  icon?: string;
  skip?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
  isLast?: boolean;
}