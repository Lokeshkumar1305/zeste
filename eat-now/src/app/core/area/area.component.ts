import { Component } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { AreaTableModalComponent } from '../area-table-modal/area-table-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent {
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
    const dialogRef = this.dialog.open(AreaTableModalComponent, {
      data: { type: 'AREA' },
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
