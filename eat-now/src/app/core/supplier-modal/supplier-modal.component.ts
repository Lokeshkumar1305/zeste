import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Area, Table } from '../../common-library/model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-supplier-modal',
  templateUrl: './supplier-modal.component.html',
  styleUrl: './supplier-modal.component.scss'
})
export class SupplierModalComponent {

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['area']
  @ViewChild('supplierForm')
  supplierForm!: NgForm;
  @ViewChild('supplierForm') itemForm!: NgForm;
  constructor(private dialogRef: MatDialogRef<SupplierModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {

  }
  ngOnInit() {
   
    this.addRow();

  }
  dialogClose() {
    // this.closeAnimation = true; // Apply the closing animation class
    this.dialogRef.removePanelClass('custom-dialog-animation');
    this.dialogRef.addPanelClass('custom-dialog-close-animation');
    setTimeout(() => {
      this.dialogRef.close();
    }, 250);

  }
  addRow() {
    if (this.data.type == 'SUPPLIER') {
      const newRow = new Area();
      this.dataSource.data.push(newRow);
      this.dataSource.data = [...this.dataSource.data];
      if (this.dataSource.data.length > 1) {
        this.supplierForm.untouched;
      }
    }
  }
  CreateUpdate() {

  }
}
