import { Component, ViewChild } from '@angular/core';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../common-library/services/api.service';
import { HttpClient } from '@angular/common/http';
import { roelDetails } from '../../common-library/model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss'
})
export class RoleDetailsComponent {
breadCrumb = new Array<OPSMenu>();
  displayedColumns: string[] = ['select', 'prevId', 'description'];
  pageNumber = 0;
  totalElements = 0;
  pageSize = 5;
  pageEvent: any;
  dataObj=new roelDetails();
  selection = new SelectionModel<any>(true, []);
  // dataSource!: MatTableDataSource<any>;
  dataSource = [
    {
      prevId: 'GET_USERS',
      description: 'Allows viewing the list of users',
    },
    {
      prevId: 'CREATE_USER',
      description: 'Allows creating a new user',
    },
    {
      prevId: 'DELETE_USER',
      description: 'Allows deletion of a user account',
    },
    {
      prevId: 'ASSIGN_ROLE',
      description: 'Allows assigning roles to users',
    },
    {
      prevId: 'VIEW_AUDIT_LOGS',
      description: 'Allows viewing system audit logs',
    }
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router, private postService: ApiService, public http: HttpClient,) {

  }
  ngOnInit(): void {
    const bc = [
      { "name": 'IAM', "link": "/uam/dashboard" },
      { "name": 'Role-Details', "link": "/uam/role-details" },
    ];
    this.breadCrumb = bc;
  }
  getAll(pageNumber: number, pageSize: number) {
    let obj = {
      "page": pageNumber,
      "size": pageSize,
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
  save() {
    let url =''
    this.dataObj.privilegeId = new Array<string>
     this.selection.selected.forEach((privId:any)=>{
      this.dataObj.privilegeId.push(privId.privilegeId)
     })
     console.log(this.dataObj.privilegeId)
    let obj = {
      requestObject: this.dataObj
    }
    // this.postService.doPost(api, obj).subscribe((res:any) => {
    //   this.snackbar.open(res.message, 'Dismiss', { duration: 3000 });
    //   this.getAll();
      
    // })
  }
  getPagination(event: { pageIndex: number; pageSize: number; }) {
    this.getAll(event.pageIndex, event.pageSize);
  }
  cancel() {
    this.getAll(this.pageNumber, this.pageSize);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}