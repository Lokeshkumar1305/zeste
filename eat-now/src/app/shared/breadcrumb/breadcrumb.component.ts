import { Component, Input } from '@angular/core';
import { OPSMenu } from '../en-common-table/en-common-table.component';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() breadCrumb = new Array<OPSMenu>()
  navigateViaBreadcrumb(link: string, name: string) { }
}
