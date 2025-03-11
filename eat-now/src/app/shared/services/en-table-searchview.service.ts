import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../common-library/services/api.service';
import { APIPath } from '../../common-library/api-enum';

@Injectable({
  providedIn: 'root'
})
export class EnTableSearchviewService {
  searchText!: string;
  constructor(private router: Router, public apiService: ApiService,) { }

  public getHeadTitle(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        returnValue = 'Outlet';
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        returnValue = 'Staff';
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        returnValue = 'Eat Now Staff';
        break;
      default:
        break;
    }
    return returnValue;
  }
  public getSubHeadTitle(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        returnValue = 'Uam . Outlet';
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        returnValue = '';
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        returnValue = '';
        break;
      default:
        break;
    }
    return returnValue;
  }

  public getColumnName(tableID: string): { displayedColumns: string[], columnNames: { [key: string]: string } } {
    let columnNames: { [key: string]: string } = {};
    let displayedColumns: string[] = [];
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        columnNames = {
          outletId: 'Outlet ID',
          outletName: 'Outlet Name',
          outletType: 'Outlet Type',
          contactNumber: 'Contact Number',
          status: 'Status',
          action: 'Actions',
        };
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        columnNames = {
          staffId: 'Staff ID',
          staffName: 'Staff Name',
          role: 'Role',
          contactNumber: 'Contact Number',
          status: 'Status',
          action: 'Actions',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        columnNames = {
          staffId: 'Staff ID',
          staffName: 'Staff Name',
          role: 'Role',
          contactNumber: 'Contact Number',
          status: 'Status',
          action: 'Actions',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      default:
        break;
    }
    return { displayedColumns, columnNames };
  }

  public getDisplayedColumns(tableID: string) {
    let columnName!: string[];
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        columnName = ['outletId', ' outletName', '  outletType', 'contactNumber', ' status', 'action'];
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        columnName = [' staffId', 'staffName', 'role', 'contactNumber', ' status', 'action'];
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        columnName = [' staffId', 'staffName', 'role', 'contactNumber', ' status', 'action'];
        break;
      default:
        break;
    }
    return columnName;
  }

  public getAPIPATH(tableID: string) {
    this.searchText = '';
    let columnName: APIPath;
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      default:
        break;
    }
    return columnName!;
  }


  public goToCreate(tableID: string) {
    let creurl: string;
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        creurl = '/switch-config/scheme-connection/';
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        creurl = '/switch-config/switch-destination/';
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        creurl = '/switch-config/routing-rules/';
        break;
      default:
        break;
    }
    this.router.navigate([creurl!]);
  }
  public goToInq(tableID: string, modelKey: string) {
    let inqurl: string;
    switch (tableID) {
      case 'GET_MERCHANT_DETAILS':
        inqurl = '/switch-config/scheme-connection/' + modelKey;
        break;
      case 'GET_MERCHANTSTAFF_DETAILS':
        inqurl = '/switch-config/switch-destination/' + modelKey;
        break;
      case 'GET_EATNOWSTAFF_DETAILS':
        inqurl = '/switch-config/routing-rules/' + modelKey;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(inqurl!);
  }
}
