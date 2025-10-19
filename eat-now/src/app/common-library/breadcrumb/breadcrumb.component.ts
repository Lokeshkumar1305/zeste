import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from '../../shared/services/breadcrum.service';
import { BreadcrumbItem } from '../breadcrum.modal';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  readonly breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbService.breadcrumbs;

  constructor(private readonly breadcrumbService: BreadcrumbService) {}

  trackByUrl = (_: number, item: BreadcrumbItem) => item.url;
}