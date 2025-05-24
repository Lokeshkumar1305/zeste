import { Component, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StockModalComponent } from '../stock-modal/stock-modal.component';

@Component({
  selector: 'app-stock-moment',
  templateUrl: './stock-moment.component.html',
  styleUrl: './stock-moment.component.scss'
})
export class StockMomentComponent {

 breadCrumb = new Array<OPSMenu>();
  displayedColumns: string[] = [ 'itemName','quantity','momentType','remark','actions'];
  pageNumber = 0;
  totalElements = 0;
  pageSize = 5;
  pageEvent: any;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router, private postService: ApiService, public http: HttpClient,public dialog: MatDialog) {

  }
  ngOnInit(): void {
    const bc = [
      { "name": 'Home', "link": "/uam/users" },
      { "name": 'Stock', "link": "/core/stock-moment" },
    ];
    this.breadCrumb = bc;
  }
  addOutlet(){
    const dialogRef = this.dialog.open(StockModalComponent, {
          data:{type:'STOCK'},
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
  orderInq(element: any) {
  }
  getPagination(event: { pageIndex: number; pageSize: number; }) {
    this.getAll(event.pageIndex, event.pageSize);
  }
}