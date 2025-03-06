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
      case 'GET_SCHEME_CONNECTION':
        returnValue = 'Scheme Connection';
        break;
      case 'GET_SWITCH_DESTINATIONS':
        returnValue = 'Switch Destination';
        break;
      case 'GET_TRANSACTION_DETAILS':
        returnValue = 'Transaction Details';
        break;
      case 'GET_BIN_DETAILS':
        returnValue = 'Bin Details';
        break;
      case 'GET_USERS':
        returnValue = 'Users';
        break;
      case 'GET_ROUTING_RULES':
        returnValue = 'Routing Table';
        break;
      case 'GET_ROLES':
        returnValue = 'Roles';
        break;
      case 'GET_PRIVILEGES':
        returnValue = 'Privileges';
        break;
      case 'GET_SERVICE_DIRECTORY':
        returnValue = 'Service Directory';
        break;
      case 'GET_MAKER_CHECKER':
        returnValue = 'Maker Checker';
        break;
      default:
        break;
    }
    return returnValue;
  }
  public getSubHeadTitle(tableID: string) {
    let returnValue = '';
    switch (tableID) {
      case 'GET_SCHEME_CONNECTION':
        returnValue = 'Scheme Connection';
        break;
      case 'GET_SWITCH_DESTINATIONS':
        returnValue = 'Switch Destination';
        break;
      case 'GET_TRANSACTION_DETAILS':
        returnValue = 'Transaction Details';
        break;
      case 'GET_BIN_DETAILS':
        returnValue = 'View BIN table defined in the system, Add new BIN and its atributes';
        break;
      case 'GET_USERS':
        returnValue = 'View all the Active users, Create new users, assign roles and permissions.';
        break;
      case 'GET_ROUTING_RULES':
        returnValue = 'Routing Table';
        break;
      case 'GET_ROLES':
        returnValue = 'View all the Active users, Create new users, assign roles and permissions.';
        break;
      case 'GET_PRIVILEGES':
        returnValue = 'View all the Active users, Create new users, assign roles and permissions.';
        break;
      case 'GET_SERVICE_DIRECTORY':
        returnValue = 'Service Directory';
        break;
      case 'GET_MAKER_CHECKER':
        returnValue = 'Maker Checker';
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
      case 'GET_SCHEME_CONNECTION':
        columnNames = {
          destination: 'Destination',
          connectionId: 'Connection ID',
          connectionPoolId: 'Connection Pool ID',
          ip: 'IP',
          port: 'Port',
          mode: '	Mode',
          action: 'Actions',
        };
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_SWITCH_DESTINATIONS':
        columnNames = {
          destination: 'Destination',
          name: 'Name',
          destinationId: 'Destination ID',
          action: 'Actions',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_ROUTING_RULES':
        columnNames = {
          source: 'Source',
          transactionType: 'Transaction Type',
          onUsOffUs: 'Onus / Offus',
          cardBrand: 'CardBrand',
          destination: '	Destination',
          destinationId: 'Destination ID',
          action: 'Actions',
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_TRANSACTION_DETAILS':
        columnNames = {
          transactionDate: ' Transaction Date',
          postingDate: ' Posting Date',
          merchantNo: ' Merchant No',
          amount: 'Amount',
          rrn: 'RRN',
          terminal: 'Terminal',
          transactionType: 'Transaction Type',
          resp: ' Resp',
          cardNo: 'Card No',
          startDateAndTime: 'Start Date And Time',
          effTime: 'Eff.Time'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_BIN_DETAILS':
        columnNames = {
          binNumber: 'Bin Number',
          countryCode: 'Country Code',
          countryCurrency: 'Country Currency',
          productId: 'Product Id',
          bankName: ' Bank Name',
          cardName: 'Card Name',
          cardType: 'Card Type'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_USERS':
        columnNames = {
          fullName: 'Full Name',
          userId: 'User Id',
          email: 'Email Id',
          status: 'Status',
          action: 'Actions'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_ROLES':
        columnNames = {
          roleTitle: ' Role Title',
          description: 'Description',
          action: 'Actions'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_PRIVILEGES':
        columnNames = {
          privilegeNumber: 'Privilege Number',
          privilegeType: 'Privilege Type',
          userDescription: 'userDescription',
          action: 'Actions'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_SERVICE_DIRECTORY':
        columnNames = {
          name: 'Name',
          providerId: 'Provider Id',
          serviceName: 'Service Name',
          action: 'Actions'
        }
        displayedColumns = Object.keys(columnNames);
        break;
      case 'GET_MAKER_CHECKER':
        columnNames = {
          makerName: 'Maker Name',
          checkerName: 'Checker Name',
          modelName: 'Model Name',
          entryDateTime: 'Entry Date Time',
          expiryDateTime: 'Expiry Date Time',
          status: 'Status',
          action: 'Actions'
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
      case 'GET_SCHEME_CONNECTION':
        columnName = ['destination', 'connectionId', ' connectionPoolId', 'ip', ' port', 'mode', 'action'];
        break;
      case 'GET_SWITCH_DESTINATIONS':
        columnName = ['destination', 'name', 'destinationId', 'action'];
        break;
      case 'GET_ROUTING_RULES':
        columnName = ['source', 'transactionType', 'onUsOffUs', 'cardBrand', 'destination', ' destinationId', 'action'];
        break;
      case 'GET_TRANSACTION_DETAILS':
        columnName = ['transactionDate', 'postingDate', ' merchantNo', ' amount', ' rrn', 'terminal', ' transactionType', 'resp', 'cardNo', 'startDateAndTime', ' effTime'];
        break;
      case 'GET_BIN_DETAILS':
        columnName = [' binNumber', 'countryCode', 'countryCurrency', ' productId', 'bankName', 'cardName', ' cardType'];
        break;
      case 'GET_USERS':
        columnName = ['fullName', 'userId', ' email', ' status',];
        break;
      case 'GET_ROLES':
        columnName = ['roleTitle', 'description'];
        break;
      case 'GET_PRIVILEGES':
        columnName = ['privilegeNumber', 'privilegeType', 'userDescription', 'action'];
        break;
      case 'GET_SERVICE_DIRECTORY':
        columnName = ['name', 'providerId', 'serviceName', 'action'];
        break;
      case 'GET_MAKER_CHECKER':
        columnName = ['makerName', 'checkerName', 'modelName', 'entryDateTime', 'expiryDateTime', 'status', 'action'];
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
      case 'GET_SCHEME_CONNECTION':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_SWITCH_DESTINATIONS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_ROUTING_RULES':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_TRANSACTION_DETAILS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_BIN_DETAILS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_USERS':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_ROLES':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_PRIVILEGES':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_SERVICE_DIRECTORY':
        // columnName = APIPath.SW_DESTINATION_GETALL;
        break;
      case 'GET_MAKER_CHECKER':
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
      case 'GET_SCHEME_CONNECTION':
        creurl = '/switch-config/scheme-connection/';
        break;
      case 'GET_SWITCH_DESTINATIONS':
        creurl = '/switch-config/switch-destination/';
        break;
      case 'GET_ROUTING_RULES':
        creurl = '/switch-config/routing-rules/';
        break;
      default:
      case 'GET_TRANSACTION_DETAILS':
        creurl = '/switch-config/txn-details/';
        break;
      case 'GET_BIN_DETAILS':
        creurl = '/switch-config/bin-table/';
        break;
      case 'GET_SERVICE_DIRECTORY':
        creurl = '/switch-config/service-directory/';
        break;
      case 'GET_USERS':
        creurl = '/user-access/user/';
        break;
      case 'GET_ROLES':
        creurl = '/user-access/role/';
        break;
      case 'GET_PRIVILEGES':
        creurl = '/user-access/privilege/';
        break;
      case 'GET_MAKER_CHECKER':
        creurl = '/switch-config/maker-checker/';
        break;
    }
    this.router.navigate([creurl!]);
  }
  public goToInq(tableID: string, modelKey: string) {
    let inqurl: string;
    switch (tableID) {
      case 'GET_SCHEME_CONNECTION':
        inqurl = '/switch-config/scheme-connection/' + modelKey;
        break;
      case 'GET_SWITCH_DESTINATIONS':
        inqurl = '/switch-config/switch-destination/' + modelKey;
        break;
      case 'GET_ROUTING_RULES':
        inqurl = '/switch-config/routing-rules/' + modelKey;
        break;
      case 'GET_TRANSACTION_DETAILS':
        inqurl = '/switch-config/txn-details/' + modelKey;
        break;
      case 'GET_BIN_DETAILS':
        inqurl = '/switch-config/bin-table/' + modelKey;
        break;
      case 'GET_SERVICE_DIRECTORY':
        inqurl = '/switch-config/service-directory/' + modelKey;
        break;
      case 'GET_USERS':
        inqurl = '/user-access/user/' + modelKey;
        break;
      case 'GET_ROLES':
        inqurl = '/user-access/role/' + modelKey;
        break;
      case 'GET_PRIVILEGES':
        inqurl = '/user-access/privilege/' + modelKey;
        break;
      case 'GET_MAKER_CHECKER':
        inqurl = '/switch-config/maker-checker/' + modelKey;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(inqurl!);
  }
}
