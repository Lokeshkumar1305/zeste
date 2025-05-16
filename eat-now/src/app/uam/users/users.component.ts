import { Component, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  breadCrumb = new Array<OPSMenu>();
  displayedColumns: string[] = ['role', 'description', 'permissions', 'actions'];
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
      { "name": 'IAM', "link": "/uam/users" },
      { "name": 'Roles', "link": "/core/staff-onboarding-getAll" },
    ];
    this.breadCrumb = bc;
  }
  addRole() {
    this.router.navigate(['/core/staff-onboarding']);
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
  staffInq(element: any) {
  }
  getPagination(event: { pageIndex: number; pageSize: number; }) {
    this.getAll(event.pageIndex, event.pageSize);
  }
}