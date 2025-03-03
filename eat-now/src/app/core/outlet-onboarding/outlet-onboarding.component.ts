import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-outlet-onboarding',
  templateUrl: './outlet-onboarding.component.html',
  styleUrl: './outlet-onboarding.component.scss'
})

export class OutletOnboardingComponent {
  id!: any;
  dataObj = new residentDetails();
  addressObj = new residentAddress();
  fileSizeError!: boolean;
  fileTypeError!: boolean;
  fileArray = new Array<any>();
  vehicleobj = new Vehicle();
  familyobj = new FamilyMember();
  flatobj = new Flat();
  residentObj = new residentDocument();
  fileName = new Array<any>();
  isfileUploaded!: boolean;
  file: any;
  issoloproprietor: boolean = false;
  isPartnership: boolean = false;
  mobileNo!: string;
  userEmail!: string;
  DocumentName!: any;
  documentPath!: any;
  saleDeedDocName!: any;
  saleDeedDocPath!: any;
  docLeaseName!: any;
  docLeasePath!: any;
  rcName!: any;
  rcPath!: any;
  selectedTabIndex: number = 0;
  datasource = new Array<Vehicle>();
  datasource1 = new Array<FamilyMember>();
  displayedColumns: string[] = ['position',];
  isCreateMode!: boolean;
  selectedRegistrationType: boolean = false;
  constructor(public router: Router, public route: ActivatedRoute,
    public snackbar: MatSnackBar, public dialog: MatDialog, private location: Location, private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.addVehicleRow();
    this.addOccupantRow();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id != 'cre') {
        this.isCreateMode = false;
        // this.residentInq();
      }
      else {
        this.isCreateMode = true;
      }
    })
  }

  //CHANGE INTO CAPITAL LETTERS
  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }


  addVehicleRow() {

    const newRow = new Vehicle();
    debugger
    // Check for duplicates based on vehicleNumber
    const isDuplicate = this.datasource.some(element => element.vehicleNumber === newRow.vehicleNumber);
    debugger
    this.datasource.push(this.vehicleobj)
    if (isDuplicate) {
      alert('This vehicle number already exists. Please enter a unique vehicle number.');
      return;
    }

    this.datasource.push(newRow);
    this.datasource = [...this.datasource];
    // this.updateDuplicateValues();
  }

  updateDuplicateValues() {
    this.duplicateValues = this.datasource.map((element, index) => {
      return this.datasource.some((otherElement, otherIndex) =>
        otherIndex !== index && otherElement.vehicleNumber === element.vehicleNumber
      );
    });
  }

  // Method to check for duplicates when a vehicle number is changed
  // duplicateCheck(index: number) {
  //   this.updateDuplicateValues();
  // }

  // Method to delete a row
  // deleteRow(index: number) {
  //   this.datasource.splice(index, 1);
  //   this.updateDuplicateValues(); // Update duplicate values after deletion
  // }

  trackBy(index: number, row: Vehicle): number {
    return index; // Use index as a unique identifier
  }




  // deleteRow(removeindex: number) {
  //   const dialogRef = this.dialog.open(ConfirmationDailogComponent, {
  //     width: '420px',
  //     height: '180px',
  //     data: { recordId: "Delete" },
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       for (let i = 0; i < this.datasource?.length; i++) {
  //         if (removeindex === +i) {
  //           this.datasource?.splice(removeindex, 1);
  //         }
  //       }
  //       this.datasource = [...this.datasource];
  //     }
  //   });
  //   // let obj = {
  //   //   recordId: "Delete",
  //   // }
  //   // let dialogRef = this.dialog.open(, {
  //   //   width: '420px',
  //   //   height: '301px',
  //   //   data: obj,
  //   // });
  //   // dialogRef.afterClosed().subscribe(result => {
  //   //    
  //   //   if (result) {
  //   //     for (let i = 0; i < this.datasource?.length; i++) {
  //   //       if (removeindex === +i) {
  //   //         this.datasource?.splice(removeindex, 1);
  //   //       }
  //   //     }
  //   //     this.datasource = [...this.datasource];
  //   //   }

  //   //   // this.isDuplicate = false;
  //   // });
  // }

  addOccupantRow() {
    const newRow = new FamilyMember();
    this.datasource1.push(newRow);
    this.datasource1 = [...this.datasource1];
    // this.duplicateValues = [];
  }

  // deleteOccupantRow(removeindex: number) {
  //   const dialogRef = this.dialog.open(ConfirmationDailogComponent, {
  //     width: '420px',
  //     height: '180px',
  //     data: { recordId: "Delete" },
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       for (let i = 0; i < this.datasource1?.length; i++) {
  //         if (removeindex === +i) {
  //           this.datasource1?.splice(removeindex, 1);
  //         }
  //       }
  //       this.datasource1 = [...this.datasource1];
  //     }
  //   });
  //   // let obj = {
  //   //   recordId: "Delete",
  //   // }
  //   // let dialogRef = this.dialog.open(, {
  //   //   width: '420px',
  //   //   height: '301px',
  //   //   data: obj,
  //   // });
  //   // dialogRef.afterClosed().subscribe(result => {
  //   //    
  //   //   if (result) {
  //   //     for (let i = 0; i < this.datasource?.length; i++) {
  //   //       if (removeindex === +i) {
  //   //         this.datasource?.splice(removeindex, 1);
  //   //       }
  //   //     }
  //   //     this.datasource = [...this.datasource];
  //   //   }

  //   //   // this.isDuplicate = false;
  //   // });
  // }



  // create() {
  //   this.dataObj.emailId = this.encryptservice.encrypt(this.dataObj.emailId);
  //   this.dataObj.mobile = this.encryptservice.encrypt(this.dataObj.mobile);
  //   this.dataObj.vehicle = this.datasource;

  //   if (this.documentPath) {
  //     this.dataObj.docIdentityProof = this.documentPath;
  //   }
  //   if (this.saleDeedDocPath) {
  //     this.dataObj.docSaleDeed = this.saleDeedDocPath;
  //   }
  //   if (this.docLeasePath) {
  //     this.dataObj.docLeaseAgreement = this.docLeasePath;
  //   }
  //   if (this.rcPath) {
  //     const vehicleDoc: residentDocument = {
  //       documentId: '',
  //       documentName: this.rcName || '',
  //       documentType: 'vehicleRegistrationCertificate',
  //       size: '',
  //       documentPath: this.rcPath
  //     };
  //     this.dataObj.vehicle[0].vehicleRegistrationCertificate = vehicleDoc;
  //   }

  //   this.postService.doPostInq(APIPATH.RESIDENT_CREATE, this.dataObj).subscribe((res: any) => {
  //     console.log(res);
  //     if (res.responseObject) {
  //       let obj = {
  //         message: res.message,
  //       };
  //       this.dialog.open(ConfirmationDailogComponent, {
  //         width: '420px',
  //         height: '301px',
  //         data: obj
  //       });
  //     } else {
  //       this.snackbar.open(res.message, 'Dismiss', { duration: 3000 });
  //     }
  //   });
  // }



  // saveResident() {
  //   if (this.isCreateMode)
  //     this.create();
  //   else
  //     this.update();
  // }


  // update() {
  //   this.dataObj.emailId = this.encryptservice.encrypt(this.dataObj.emailId)
  //   this.dataObj.mobile = this.encryptservice.encrypt(this.dataObj.mobile)
  //   let url = APIPATH.RESIDENT_UPD + this.id
  //   this.postService.doPutInq(url, this.dataObj).subscribe((res: any) => {
  //     console.log(res);
  //     this.snackbar.open(res.message, 'Dismiss', { duration: 3000 });
  //     this.location.back();
  //   })
  // }

  // residentInq() {
  //   this.id = this.route.snapshot.paramMap.get('id');
  //   if (this.id != 'cre') {
  //     let url = APIPATH.RESIDENT_INQ + this.id
  //     this.postService.doGetInq(url).subscribe((res: any) => {
  //       this.dataObj = res.responseObject;
  //       this.flatobj = res.responseObject.flat;
  //       this.addressObj = res.responseObject;
  //       this.datasource = res.responseObject.vehicle;
  //       this.datasource1 = res.responseObject.familyMembers

  //       if (this.dataObj) {
  //         this.dataObj.emailId = this.encryptservice.decrypt(this.dataObj.emailId) ?? '';
  //         this.dataObj.mobile = this.encryptservice.decrypt(this.dataObj.mobile) ?? '';

  //         if (this.dataObj.docIdentityProof) {
  //           this.documentPath = this.dataObj.docIdentityProof;
  //           this.DocumentName = this.dataObj.docIdentityProof;
  //           console.log('docIdentityProof Path:', this.documentPath);
  //           console.log('docIdentityProof Name:', this.DocumentName);

  //         }

  //         if (this.dataObj.docSaleDeed) {
  //           let docName: string;
  //           docName = this.dataObj.docSaleDeed;
  //           let docArray = docName.split("/");
  //           this.saleDeedDocName = docArray[5];
  //         }

  //         if (this.dataObj.docLeaseAgreement) {
  //           this.docLeasePath = this.dataObj.docLeaseAgreement;
  //           this.docLeaseName = this.dataObj.docLeaseAgreement;
  //         }

  //         if (this.dataObj.vehicle && this.dataObj.vehicle[0]?.vehicleRegistrationCertificate) {
  //           this.rcPath = this.dataObj.vehicle[0].vehicleRegistrationCertificate.documentPath;
  //           this.rcName = this.dataObj.vehicle[0].vehicleRegistrationCertificate.documentName;
  //         }
  //       }
  //       console.log(this.dataObj);
  //     }, err => {
  //       console.error('Error fetching resident details:', err);
  //     });
  //   }
  // }

  remove(type: string) {
    switch (type) {
      case 'saleDeedDocName':
        this.dataObj.docSaleDeed = '';
        break;
      case 'DocumentName':
        this.dataObj.docIdentityProof = '';
        break;
      case 'docLeaseName':
        this.dataObj.docLeaseAgreement = '';
        break;
      case 'rcName':
        if (this.dataObj.vehicle[0]) {
          this.dataObj.vehicle[0].vehicleRegistrationCertificate = new residentDocument();
        }
        this.rcName = '';
        this.rcPath = '';
        this.ischip = false;
        break;
      default:
        break;
    }
  }


  backToMain() {
    this.location.back();
  }
  cancel() {
    this.location.back();
  }
  cancelProperty() {
    this.router.navigate(['./resident/resident-directory']);

  }

  //CHECKBOX FOR RESIDENT TYPE
  onCheckboxChange(): void {
    this.selectedRegistrationType = !!this.dataObj.registrationType;
    if (this.dataObj.registrationType === 'SOLOPROPRIETOR') {
      this.issoloproprietor = true;
      this.isPartnership = false;
    }
    else {
      this.issoloproprietor = false;
      this.isPartnership = true;
    }
  }

  //TITLECASE PIPE
  transform(value: string): string {
    if (!value) return value;
    return value.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Function to go to the next tab
  goToNextTab() {
    if (this.selectedTabIndex < 6) {
      this.selectedTabIndex += 1;
    }
  }

  getLabelBasedOnUnitType(unitType: string): string {
    switch (unitType) {
      case 'APARTMENT':
        return 'Flat No';
      case 'CONDO':
        return 'Condo No';
      case 'VILLA':
        return 'Villa No';
      default:
        return 'Flat No';
    }
  }

  ischip: boolean = false



  // onFileChange(event: any, documentType: string) {
  //   this.file = event.target.files[0];
  //   if (this.file) {
  //     if (this.file.size > 5 * 1024 * 1024) {
  //       this.fileSizeError = true;
  //       this.fileTypeError = false;
  //     } else {
  //       this.fileSizeError = false;
  //     }
  //     if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(this.file.type)) {
  //       this.fileTypeError = true;
  //     } else {
  //       this.fileTypeError = false;
  //     }
  //     const formData = new FormData();
  //     formData.append('file', this.file);
  //     formData.append('id', this.encryptservice.encrypt(this.dataObj.emailId));
  //     formData.append('legalDocType', 'AADHAR')
  //     this.postService.uploadDoc(APIPATH.COMMUNITY_FILE_UPLOAD, formData).subscribe((res: any) => {
  //       if (res.success && res.responseObject) {
  //         switch (documentType) {
  //           case 'docIdentityProof':
  //             this.dataObj.docIdentityProof = res.responseObject;
  //             this.DocumentName = res.responseObject.documentName
  //             this.documentPath = res.responseObject.documentPath
  //             break;
  //           case 'docSalesDeed':
  //             this.dataObj.docSaleDeed = res.responseObject;
  //             this.saleDeedDocName = res.responseObject.documentName
  //             this.saleDeedDocPath = res.responseObject.documentPath
  //             break;
  //           case 'docLeaseAgreement':
  //             this.dataObj.docLeaseAgreement = res.responseObject;
  //             this.docLeaseName = res.responseObject.documentName
  //             this.docLeasePath = res.responseObject.documentPath
  //             break;
  //           case 'vehicleRegistrationCertificate':
  //             this.vehicleobj.vehicleRegistrationCertificate = res.responseObject
  //             // this.ischip = true
  //             break;
  //           default:

  //             break;
  //         }
  //       } else {
  //         this.dataObj.docSaleDeed = res.responseObject
  //         console.error('File upload failed');
  //       }
  //     }, err => {
  //       console.error('Error uploading file:', err);
  //     });

  //   }
  // }





  // download(value: any) {
  //   let obj = {
  //     filePath: value
  //   }
  //   this.postService.downloadDoc(APIPATH.COMMUNITY_FILE_DOWNLOAD, obj).subscribe((res: any) => {
  //     // this.previewImage(url);
  //     this.openFile(res.body, res);
  //   },
  //     (error) => {
  //       this.snackbar.open("Something Wrong!");
  //     }
  //   );
  // }
  getImage: any
  // openFile(data: any, typ: string) {
  //   const blob = new Blob([data], { type: typ });
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => {
  //     this.getImage = reader.result;
  //     if (this.getImage) {
  //       if (this.getImage.fileType?.includes('image/')) {
  //         const dialogRef = this.dialog.open(RwaOpenFileComponent, {
  //           hasBackdrop: true,
  //           disableClose: true,
  //           width: '600px',
  //           height: '500px',
  //           data: this.getImage
  //         });
  //       } else {
  //         let link = document.createElement('a');
  //         link.download = 'file';
  //         link.href = this.getImage;
  //         link.click();
  //       }
  //     }
  //   }, false);
  //   if (blob) {
  //     reader.readAsDataURL(blob);
  //   }
  // }


  // DUPLICATE CHECK
  isDuplicate!: boolean;
  duplicateValues = new Array<boolean>()
  duplicateCheck(j: number) {
    if (this.datasource.length > 1) {
      for (let i = 0; i < this.datasource.length - 1; i++) {
        if (this.datasource[i].vehicleNumber == this.datasource[j].vehicleNumber) {
          // this.isDuplicate = true;
          // this.duplicateValues[j] = true;
          this.snackBar.open('This vehicle number already exists. Please enter a unique vehicle number.', 'Close', {
            duration: 3000,
          }); break;

        }
        else {
          this.isDuplicate = false;
          this.duplicateValues[j] = false
        }
      }
    }
  }





}






export class residentAddress {
  addressline1!: string
  addressline2!: string
  street!: string
  zipcode!: string
  city!: string
  state!: string
  country!: string
}


export class Flat {
  block!: string;
  doorNo!: string;
  floor!: number;
  unitType!: string;
  residentId!: string;
  legalOwner!: string;
  registerId!: string;
}

export class PersonalInfo {
  firstName!: string;
  middleName!: string;
  lastName!: string;
  dateOfBirth!: string;
  gender!: string;
}

export class FamilyMember {
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string;
  gender!: string;
  mobile!: string;
}

export class residentDocument {
  documentId!: string;
  documentName!: string;
  documentType!: string;
  size!: string;
  documentPath!: string;
}

export class Vehicle {
  vehicleNumber!: string;
  vehicleType!: string;
  vehicleRegistrationCertificate!: residentDocument;

  constructor() {
    this.vehicleRegistrationCertificate = new residentDocument();
  }
}

export class Pet {
  petType!: string;
  vaccinationStatus!: string;
  vaccinationProof!: string;
}
export class residentDetails {
  id!: string;
  flat!: Flat;
  personalInformation!: PersonalInfo;
  emailId!: string;
  mobile!: string;
  registrationType!: string;
  communityName!: string;
  communityId!: string;
  addressline1!: string
  addressline2!: string
  street!: string
  zipcode!: string
  city!: string
  state!: string
  country!: string
  searchValue: any;
  residentSearch: any;
  nameSearch: any;
  memberSearch: any;
  statusSearch: any;
  familyMembers: Array<FamilyMember>;
  vehicle!: Array<Vehicle>;
  pet!: Array<Pet>;
  commiteeMember!: string;
  docIdentityProof!: string;
  docSaleDeed!: string;
  docLeaseAgreement!: string;


  constructor() {
    this.flat = new Flat();
    this.personalInformation = new PersonalInfo();
    this.familyMembers = new Array<FamilyMember>();
    this.vehicle = new Array<Vehicle>();
    this.pet = new Array<Pet>();
  }

}


export class rwaUploadResponse {
  documentId!: string;
  documentName!: any;
  documentType!: string;
  documentPath!: any;
}
