import { Component, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Categories } from '../../common-library/model';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';
import { Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption.service';
import { ApiService } from '../../common-library/services/api.service';
import { APIPath } from '../../common-library/api-enum';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss'
})
export class CategoryModalComponent {
dataSource = new MatTableDataSource<any>();
  dataObj = new Categories();
  @ViewChild('MenuForm')
  AreaForm!: NgForm;
  @ViewChild('TableForm') TableForm!: NgForm;
  id: any;
  constructor(private dialogRef: MatDialogRef<MenuModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
private router: Router, public encryptservice: EncryptionService, public postService: ApiService) {

  }
  ngOnInit() {
    
   
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


// createCategory() {
//   const payload = {
//     requestObject: {
//       ...this.dataObj,
//       image: this.uploadedImage || '',  
//       outletId: this.id,       
//     }
//   };

//   this.postService.doPost(APIPath.CREATE_CATEGORY, payload).subscribe({
//     next: (response) => {
//       console.log('Category created successfully:', response);

//       this.dialogRef.close(payload.requestObject); 
//     },
//     error: (err) => {
//       console.error('Error while creating category:', err);
//     }
//   });

// }


createCategory() {
  const payload = {
    requestObject: {
      ...this.dataObj,   
      image: this.uploadedImage || '',
    }
  };

  this.postService.doPost(APIPath.CREATE_CATEGORY, payload).subscribe((response: any) => {
    console.log(response);
  });
}



 
}
