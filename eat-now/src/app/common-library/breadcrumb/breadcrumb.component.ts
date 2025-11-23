import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from '../../shared/services/breadcrum.service';
import { BreadcrumbItem } from '../breadcrum.modal';
import { LayoutService } from '../../shared/services/layout.service';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  readonly breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbService.breadcrumbs;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
 public readonly layout: LayoutService 
  ) {}

  trackByUrl = (_: number, item: BreadcrumbItem) => item.url;
}