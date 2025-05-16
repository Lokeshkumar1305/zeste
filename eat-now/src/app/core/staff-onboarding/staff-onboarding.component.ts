import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Outlet, Owners, Staff } from '../../common-library/model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-staff-onboarding',
  templateUrl: './staff-onboarding.component.html',
  styleUrl: './staff-onboarding.component.scss'
})
export class StaffOnboardingComponent {
  isLinear = false;
  profileName!: string;
  name!: string;
  id!: any;
  dataObj = new Staff();
  displayedColumns=['Owners'];
  breadCrumb = new Array<OPSMenu>();
  constructor(public router: Router, public route: ActivatedRoute,
    public snackbar: MatSnackBar, public dialog: MatDialog, private location: Location, private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const bc = [
      { "name": 'UAM', "link": "/uam/users" },
      { "name": ' Staff Onboarding', "link": "/core/staff-onboarding" },
    ];
    this.breadCrumb = bc;
  }
 
}
