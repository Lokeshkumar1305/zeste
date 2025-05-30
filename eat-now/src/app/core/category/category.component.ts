import { Component } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
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
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      data: { type: 'Category' },
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
