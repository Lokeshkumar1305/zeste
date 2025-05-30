import { Component, ViewChild } from '@angular/core';
import { AreaTableModalComponent } from '../area-table-modal/area-table-modal.component';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  breadCrumb = new Array<OPSMenu>();
     displayedColumns: string[] = ['id', 'itemType', 'itemName', 'category', 'price', 'status', 'actions'];
     pageNumber = 0;
     totalElements = 0;
     pageSize = 5;
     pageEvent: any;
     dataSource!: MatTableDataSource<any>;
     @ViewChild(MatPaginator) paginator!: MatPaginator;
     constructor(private router: Router, private postService: ApiService, public http: HttpClient, public dialog: MatDialog) {
   
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



  
    addOutlet(){
      this.router.navigate(['/core/outlet-onboarding']);
    }
    getAll(index: number, size: number) {
      let obj = {
        "page": index,
        "size": size,
        "sortField": "text2",
        "sortOrder": "ASC"
      }
      let url = 'APIPATH.STUDENT_GETALL'
  
      // this.postService.getAll(url, obj).subscribe((res: any) => {
      //   this.dataSource = res.responseObject;
      //   this.totalElements = res.totalCount;
      //   if (this.paginator) {
      //     this.dataSource.paginator = this.paginator;
      //   } else {
      //     setTimeout(() => {
      //       if (this.paginator) {
      //         this.dataSource.paginator = this.paginator;
  
      //       }
      //     });
      //   }
      // })
    }
    outletInq(element: any) {
    }
    getPagination(event: { pageIndex: number; pageSize: number; }) {
      this.getAll(event.pageIndex, event.pageSize);
    }

    
}
