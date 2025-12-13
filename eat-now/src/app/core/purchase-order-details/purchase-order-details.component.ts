import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Orders, Outlet, Owners } from '../../common-library/model';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrl: './purchase-order-details.component.scss'
})
export class PurchaseOrderDetailsComponent {
  breadCrumb = new Array<OPSMenu>();
  dataObj = new Orders();
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
  }}