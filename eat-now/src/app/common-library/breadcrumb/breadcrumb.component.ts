import { Component, Input } from '@angular/core';
import { ENbreadcrumb } from '../model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() breadCrumb = new Array<ENbreadcrumb>()
  
  // Method to handle navigation via a breadcrumb link
  navigateViaBreadcrumb(link: string, name: string) { }
}
