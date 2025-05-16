import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Outlet, Owners } from '../../common-library/model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-outlet-onboarding',
  templateUrl: './outlet-onboarding.component.html',
  styleUrl: './outlet-onboarding.component.scss'
})

export class OutletOnboardingComponent {
  isLinear = false;
  profileName!: string;
  name!: string;
  id!: any;
  dataObj = new Outlet();
  datasource=new Array<Owners>();
  displayedColumns=['Owners'];
  breadCrumb = new Array<OPSMenu>();
  constructor(public router: Router, public route: ActivatedRoute,
    public snackbar: MatSnackBar, public dialog: MatDialog, private location: Location, private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const bc = [
      { "name": 'UAM', "link": "/uam/users" },
      { "name": 'Outlet onboarding', "link": "/core/outlet-onboarding" },
    ];
    this.breadCrumb = bc;
    this.dataObj.outletRegistrationType = 'SOLOPROPRIETOR';
    this.addRow()
  }
  addRow() {
    const newRow = new Owners();
    this.datasource.push(newRow);
    this.datasource = [...this.datasource];
    // this.duplicateValues = [];
  }
  addpartner() {
    // const ownerInfo = new owners()
    // if (!this.dataObj.owners) {
    //   this.dataObj.owners = new Array<owners>
    // }
    // this.dataObj.owners.push(ownerInfo);
  }
}
