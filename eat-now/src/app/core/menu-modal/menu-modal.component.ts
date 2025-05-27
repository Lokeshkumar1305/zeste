import { Component, Inject, ViewChild } from '@angular/core';
import { Area, Menu, Table } from '../../common-library/model';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AreaTableModalComponent } from '../area-table-modal/area-table-modal.component';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrl: './menu-modal.component.scss'
})
export class MenuModalComponent {
 dataSource = new MatTableDataSource<any>();
  dataSource1 = new MatTableDataSource<any>();
  @ViewChild('MenuForm')
  AreaForm!: NgForm;
  @ViewChild('TableForm') TableForm!: NgForm;
  constructor(private dialogRef: MatDialogRef<MenuModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {

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
    if (this.data.type == 'MENU') {
      const newRow = new Menu();
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


  hasVariants = false;
  variants: any[] = [];
  displayedColumns: string[] = ['variant'];

  toggleVariants() {
    if (!this.hasVariants) {
      this.variants = [];
    } else {
      this.variants = [{ variantName: '', variantCode: '' }];
    }
  }

  addVariant() {
    this.variants.push({ variantName: '', variantCode: '' });
  }

  removeVariant(index: number) {
    this.variants.splice(index, 1);
  }

  

}
