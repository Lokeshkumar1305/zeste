import { Component, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent {

 breadCrumb = new Array<OPSMenu>();
  displayedColumns: string[] = ['itemName','category','brand','quantity','supplierName','actions'];
  pageNumber = 0;
  totalElements = 0;
  pageSize = 5;
  pageEvent: any;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router, private postService: ApiService, public http: HttpClient,) {

  }
  ngOnInit(): void {
    const bc = [
      { "name": 'Home', "link": "/uam/users" },
      { "name": 'Purchase-Order', "link": "/core/purchase-order" },
    ];
    this.breadCrumb = bc;
  }
  addOrders(){
    this.router.navigate(['/core/purchase-order-details']);
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