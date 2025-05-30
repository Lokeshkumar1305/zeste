import { Component, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Categories } from '../../common-library/model';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss'
})
export class CategoryModalComponent {
dataSource = new MatTableDataSource<any>();
  variants = new MatTableDataSource<any>();
  hasVariation = false;
  dataObj = new Categories();
  displayedColumns: string[] = ['variant'];
  @ViewChild('MenuForm')
  AreaForm!: NgForm;
  @ViewChild('TableForm') TableForm!: NgForm;
  constructor(private dialogRef: MatDialogRef<MenuModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {

  }
  ngOnInit() {
    this.addRow();
   
  }
  dialogClose() {
    this.dialogRef.removePanelClass('custom-dialog-animation');
    this.dialogRef.addPanelClass('custom-dialog-close-animation');
    setTimeout(() => {
      this.dialogRef.close();
    }, 250);

  }

    uploadedImage: string | ArrayBuffer | null = null;

 uploadFile(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.uploadedImage = e.target?.result || null;  
    };

    reader.readAsDataURL(file);
  }
}


  addRow() {
    if (this.data.type == 'Category') {
      const newRow = new Categories();
      this.variants.data.push(newRow);
      this.variants.data = [...this.variants.data];
      if (this.variants.data.length > 1) {
        this.TableForm.untouched;
      }
    }
  }
  CreateUpdate() {

  }



removeVariant(index: number): void {
  const updatedData = [...this.variants.data]; 
  updatedData.splice(index, 1);                
  this.variants.data = updatedData;            
}


 
}
