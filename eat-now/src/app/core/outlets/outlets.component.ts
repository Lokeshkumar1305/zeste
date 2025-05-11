import { Component } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.component.html',
  styleUrl: './outlets.component.scss'
})
export class OutletsComponent {
 breadCrumb = new Array<OPSMenu>();
 ngOnInit(){
  this.breadCrumb = [
    { "name": 'UAM', "link": "/uam/users" },
    { "name": 'Outlet', "link": "/core/outlet-onboarding" },
  ];
 
 }
}
