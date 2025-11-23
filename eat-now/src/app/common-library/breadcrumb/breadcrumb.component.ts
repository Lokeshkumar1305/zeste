// breadcrumb.component.ts
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItem } from '../../common-library/breadcrum.modal';
import { BreadcrumbService } from '../../shared/services/breadcrum.service';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() sidebarCollapsed = false;  // This is the key!

  readonly breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbService.breadcrumbs;

  constructor(private readonly breadcrumbService: BreadcrumbService) {}

  trackByUrl = (_: number, item: BreadcrumbItem) => item.url;
}