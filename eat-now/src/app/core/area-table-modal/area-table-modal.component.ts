import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Area, Table } from '../../common-library/model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-area-table-modal',
  templateUrl: './area-table-modal.component.html',
  styleUrl: './area-table-modal.component.scss'
})
export class AreaTableModalComponent {
  dataSource = new MatTableDataSource<any>();
  dataSource1 = new MatTableDataSource<any>();
  displayedColumns = ['area']
  @ViewChild('AreaForm')
  AreaForm!: NgForm;
  @ViewChild('TableForm') TableForm!: NgForm;
  constructor(private dialogRef: MatDialogRef<AreaTableModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {

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
    debugger
    if (this.data.type == 'TABLE') {
      const newRow = new Table();
      this.dataSource1.data.push(newRow);
      this.dataSource1.data = [...this.dataSource1.data];
      if (this.dataSource1.data.length > 1) {
        this.TableForm.untouched;
      }
    }
    else {
      const newRow = new Area();
      this.dataSource.data.push(newRow);
      this.dataSource.data = [...this.dataSource.data];
      if (this.dataSource.data.length > 1) {
        this.AreaForm.untouched;
      }
    }
  }
  CreateUpdate() {

  }
}
