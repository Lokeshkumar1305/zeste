import { Component, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-staff-onboarding-get-all',
  templateUrl: './staff-onboarding-get-all.component.html',
  styleUrl: './staff-onboarding-get-all.component.scss'
})
export class StaffOnboardingGetAllComponent {
  breadCrumb = new Array<OPSMenu>();
  displayedColumns: string[] = ['name', 'ID', 'gender', 'actions'];
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
      { "name": 'Staff Dierctory', "link": "/core/staff-onboarding-getAll" },
    ];
    this.breadCrumb = bc;
  }
  addStaff() {
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

