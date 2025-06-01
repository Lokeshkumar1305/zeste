import { Component, Inject, ViewChild } from '@angular/core';
import { Area, Menu, Table, Variation } from '../../common-library/model';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AreaTableModalComponent } from '../area-table-modal/area-table-modal.component';
import { Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption.service';
import { ApiService } from '../../common-library/services/api.service';
import { APIPath } from '../../common-library/api-enum';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrl: './menu-modal.component.scss'
})
export class MenuModalComponent {
 dataSource = new MatTableDataSource<any>();
  variants = new MatTableDataSource<any>();
  hasVariation = false;
  dataObj = new Menu();
  displayedColumns: string[] = ['variant'];
  @ViewChild('MenuForm')
  AreaForm!: NgForm;
  @ViewChild('TableForm') TableForm!: NgForm;
  constructor(private dialogRef: MatDialogRef<MenuModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
private router: Router, public encryptservice: EncryptionService, public postService: ApiService) {

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
  if (this.data.type == 'Menu') {
    const newRow = new Variation();
    this.variants.data.push(newRow);
    this.variants.data = [...this.variants.data];
  }
}



removeVariant(index: number): void {
  const updatedData = [...this.variants.data]; 
  updatedData.splice(index, 1);                
  this.variants.data = updatedData;            
}

createMenu() {
 
  const payload: any = {
    ...this.dataObj,
    image: this.uploadedImage,
    variations: this.hasVariation ? this.variants.data.map(variant => ({
      variationName: variant.variantName,
      price: variant.variantCode   
    })) : []
  };

  this.postService.doPost(APIPath.CREATE_MENU, payload).subscribe({
    next: (response) => {
      console.log('Menu created successfully:', response);
      this.dialogRef.close(true); 
    },
    error: (error) => {
      console.error('Error creating menu:', error);
    }
  });
}



  CreateUpdate() {

  }






 


}
