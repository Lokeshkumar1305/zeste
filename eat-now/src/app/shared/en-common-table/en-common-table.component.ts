import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { APIPath } from '../../common-library/api-enum';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { EnTableSearchviewService } from '../services/en-table-searchview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../common-library/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { LocaldataService } from '../services/localdata.service';
import { MerchantStaffOnboardingComponent } from '../../core/merchant-staff-onboarding/merchant-staff-onboarding.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-en-common-table',
  templateUrl: './en-common-table.component.html',
  styleUrl: './en-common-table.component.scss',
  animations: [
    trigger('searchExpand', [
      state('collapsed', style({
        width: '0px',
        opacity: 0,
      })),
      state('expanded', style({
        width: '*',
        opacity: 1,
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ]),
    ]),
  ],
})
export class EnCommonTableComponent {
  ctFields: any = [];
  breadCrumb = new Array<OPSMenu>();
  columnName: any;
  headTitle = '';
  subTitle = '';
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex!: number;
  // MatPaginator Output
  pageEvent!: PageEvent;
  pageNumber = 0;
  totalElements = 0;
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any>;
  modelKey!: string;
  messageId!: APIPath;
  @Input() tableID!: string;
  private routeSubscription!: Subscription;
  isSearch!: boolean;
  value: any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('commonTableSort') commonTableSort!: MatSort;
  @ViewChild('commonTablePaginator') commonTablePaginator!: MatPaginator;
  getPagination(event: any) {

  }
  constructor(public tableService: EnTableSearchviewService, private route: ActivatedRoute,
    private apiService: ApiService, private router: Router, public dialog: MatDialog,
    public localDataService: LocaldataService, public bottomSheet: MatBottomSheet,

  ) {
    this.route.params.subscribe(routeParams => {
      this.tableID = routeParams?.['id'];
    });
  }
  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(routeParams => {
      if (routeParams['id']) {
        this.tableID = routeParams['id'];
      }
      this.getTable();
    });
    // const bc = [
    //   { "name": 'Home', "link": "/home" },
    //   { "name": 'Disputes', "link": "/clearing&Settlement/disputes" },
    // ];
    // this.breadCrumb = bc;
  }
  searchField!: string;
  getTable() {
    this.headTitle = this.tableService.getHeadTitle(this.tableID);
    this.subTitle = this.tableService.getSubHeadTitle(this.tableID);
    const columnsData = this.tableService.getColumnName(this.tableID);
    this.displayedColumns = columnsData.displayedColumns;
    this.columnName = columnsData.columnNames;
    this.messageId = this.tableService.getAPIPATH(this.tableID);
    this.getAll(this.pageNumber, this.pageSize);
  }
  getAll(pageNumber: number, pageSize: number) {
    let data;
    this.localDataService.getDBEnum().subscribe((data: any) => {
      // Extract data for the specified table name
      const tableData = data[this.tableID] || [];
      // Assign the filtered data to the dataSource
      this.dataSource = new MatTableDataSource(tableData);
      this.dataSource.sort = this.commonTableSort;
      this.dataSource.paginator = this.commonTablePaginator;
      // Optionally, set total elements based on the filtered data
      // this.totalElements = this.dataSource.data.length;
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  search() {

  }
  // ngDoCheck() {
  //   this.langCall();
  // }
  // langCall() {
  //   let columnsData: { displayedColumns: string[]; columnNames: { [key: string]: string } } | null = null;
  //   let lang = this.langService.localeLanguage;
  //   switch (lang) {
  //     case 'hi':
  //       this.headTitle = this.langService.getHeadTitleinHindi(this.tableID);
  //       this.subTitle = this.langService.getSubDescriptioninHindi(this.tableID);
  //       columnsData = this.langService.getCTColumnNameinHindi(this.tableID);
  //       break;
  //     case 'es':
  //       this.headTitle = this.langService.getHeadTitleinSpanish(this.tableID);
  //       this.subTitle = this.langService.getSubDescriptioninSpanish(this.tableID);
  //       columnsData = this.langService.getCTColumnNameinSpanish(this.tableID);
  //       break;
  //     case 'zh':
  //       this.headTitle = this.langService.getHeadTitleinChinese(this.tableID);
  //       this.subTitle = this.langService.getSubDescriptioninChinese(this.tableID);
  //       columnsData = this.langService.getCTColumnNameinChinese(this.tableID);
  //       break;
  //     case 'ar':
  //       this.headTitle = this.langService.getHeadTitleinArabic(this.tableID);
  //       this.subTitle = this.langService.getSubDescriptioninArabic(this.tableID);
  //       columnsData = this.langService.getCTColumnNameinArabic(this.tableID);
  //       break;
  //     default:
  //       this.headTitle = this.tableService.getHeadTitle(this.tableID);
  //       columnsData = this.tableService.getColumnName(this.tableID);
  //       break;
  //   }
  //   if (columnsData) {
  //     this.displayedColumns = columnsData.displayedColumns;
  //     this.columnName = columnsData.columnNames;
  //   } else {
  //     console.warn('No valid columns data available');
  //   }
  // }
  newRow(tableID: string) {
    let dialogRef!: any;
    if (tableID == 'GET_SWITCH_DESTINATIONS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_ROUTING_RULES') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '40vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_SCHEME_CONNECTION') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_BIN_DETAILS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_USERS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_ROLES') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_PRIVILEGES') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_SERVICE_DIRECTORY') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
      });
    } else if (tableID == 'GET_MAKER_CHECKER') {
      return this.tableService.goToCreate(tableID);
    }
  }
  editRow(tableID: string, dataObj: any) {
    let dialogRef!: any;
    if (tableID == 'GET_SWITCH_DESTINATIONS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_ROUTING_RULES') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_SCHEME_CONNECTION') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_BIN_DETAILS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_USERS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_ROLES') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_PRIVILEGES') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_SERVICE_DIRECTORY') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    } else if (tableID == 'GET_REPORTS') {
      dialogRef = this.dialog.open(MerchantStaffOnboardingComponent, {
        width: '80%',
        height: '700px',
        position: { top: '0px', right: '0px' },
        autoFocus: false,
        minHeight: '100vh',
        maxWidth: '50vw',
        minWidth: '600px',
        panelClass: 'custom-dialog-animation',
        disableClose: true,
        data: dataObj
      });
    }
  }
  applyFilter(event: any) {

  }


  readRow(tableID: string, dataObj: any) {
    this.bottomSheet.open(MerchantStaffOnboardingComponent, {
      data: dataObj,
      autoFocus: false,
      panelClass: 'custom-bootomsheet-animation',
      disableClose: true,
    }).afterDismissed().subscribe(() => {

    });
  }
}

export class OPSMenu {
  name!: string;
  link!: string;
}
