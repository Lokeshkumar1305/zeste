import { Component } from '@angular/core';
import { AreaTableModalComponent } from '../area-table-modal/area-table-modal.component';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  breadCrumb = new Array<OPSMenu>();
  constructor(public dialog: MatDialog) {

  }
  ngOnInit() {
    const bc = [
      { "name": 'Home', "link": "/uam/users" },
      { "name": 'Outlet', "link": "/core/outlet-getAll" },
    ];
    this.breadCrumb = bc;
  }
  addArea() {
    const dialogRef = this.dialog.open(MenuModalComponent, {
      data: { type: 'Menu' },
      position: { top: '0px', right: '0px' },
      autoFocus: false,
      minHeight: '100vh',
      maxWidth: '80vw',
      minWidth: '600px',
      panelClass: 'custom-dialog-animation',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: string) => {


    });
  }
}
