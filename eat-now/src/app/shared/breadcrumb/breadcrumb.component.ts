import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItem } from '../../common-library/breadcrum.modal';
import { BreadcrumbService } from '../services/breadcrum.service';
import { LayoutService } from '../services/layout.service';


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