import { Component, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  breadCrumb = new Array<OPSMenu>();
    displayedColumns: string[] = ['id', 'categoryName', 'description', 'status', 'actions'];
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
