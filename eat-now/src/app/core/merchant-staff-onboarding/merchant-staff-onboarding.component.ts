import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../common-library/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-merchant-staff-onboarding',
  templateUrl: './merchant-staff-onboarding.component.html',
  styleUrl: './merchant-staff-onboarding.component.scss'
})
export class MerchantStaffOnboardingComponent {
  id!: any;
  shiftStartTimes!: string;
  shiftEndTimes!: string;
  dataObj = new staffDetails();
  skillobj = new Skills();
  documentobj = new Document();
  mobileNo!: string;
  userEmail!: string;
  fileName = new Array<any>();
  fileSizeError!: boolean;
  fileTypeError!: boolean;
  fileArray = new Array<any>();
  isfileUploaded!: boolean;
  file: any;
  uploadDocName!: any;
  uploadDocPath!: any;
  profileSummaryDocName!: any;
  profilesummaryDocPath!: any;
  docIdentityName!: any;
  docIdentityProofPath!: any;
  educationDocName!: any;
  educationDocPath!: any;
  qualificationDocName!: any;
  qualificationDocPath!: any;
  certificationDocName!: any;
  certificationDocPath!: any;
  otherDocName!: any;
  otherDocPath!: any;
  selectedTabIndex: number = 0;
  isCreateMode!: boolean;
  datasource = new Array<EmergencyContactInfo>();
  datasource1 = new Array<WorkExperience>();
  datasource2 = new Array<Skills>();
  displayedColumns: string[] = ['position'];
  sameAsPermanent: boolean = false;


  constructor(public apiService: ApiService, public router: Router, public route: ActivatedRoute,
    public snackbar: MatSnackBar, public dialog: MatDialog, private location: Location, private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.addEmergencyRow();
    this.addskillRow();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id != 'cre') {
        this.isCreateMode = false;
        // this.staffInq();
      }
      else {
        this.isCreateMode = true;
      }
    })
  }

  addWorkRow() {
    const newRow = new WorkExperience();
    this.datasource1.push(newRow);

    this.datasource = [...this.datasource];
    // this.duplicateValues = [];
  }

  addEmergencyRow() {
    const newRow = new EmergencyContactInfo();
    this.datasource.push(newRow);

    this.datasource = [...this.datasource];
    // this.duplicateValues = [];
  }

  addskillRow() {
    this.dataObj.skills.technicalskills.push('');
    const newRow = new Skills();
    this.datasource2.push(newRow);

    this.datasource = [...this.datasource];
    // this.duplicateValues = [];
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

  // create() {
  //   this.dataObj.contactInfo.emailId = this.encryptservice.encrypt(this.dataObj.contactInfo.emailId);
  //   this.dataObj.emergencyContactInfo.mobile = this.encryptservice.encrypt(this.dataObj.emergencyContactInfo.mobile);
  //   this.dataObj.contactInfo.primaryMobile = this.encryptservice.encrypt(this.dataObj.contactInfo.primaryMobile);
  //   this.dataObj.contactInfo.secondaryMoblie = this.encryptservice.encrypt(this.dataObj.contactInfo.secondaryMoblie);
  //   this.dataObj.shiftDetails.shiftStartTime = this.shiftStartTimes;
  //   this.dataObj.shiftDetails.shiftEndTime = this.shiftEndTimes;
  //   this.postService.doPostInq(APIPATH.STAFF_CREATE, this.dataObj).subscribe((res: any) => {
  //     console.log(res);
  //     if (res.responseObject) {
  //       let obj = {
  //         message: res.message,
  //       }
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


  // saveStaff() {
  //   if (this.isCreateMode)
  //     this.create();
  //   else
  //     this.update();
  // }


  // update() {
  //   this.dataObj.contactInfo.emailId = this.encryptservice.encrypt(this.dataObj.contactInfo.emailId)
  //   this.dataObj.emergencyContactInfo.mobile = this.encryptservice.encrypt(this.dataObj.emergencyContactInfo.mobile)
  //   this.dataObj.contactInfo.primaryMobile = this.encryptservice.encrypt(this.dataObj.contactInfo.primaryMobile);
  //   this.dataObj.contactInfo.secondaryMoblie = this.encryptservice.encrypt(this.dataObj.contactInfo.secondaryMoblie);
  //   let url = APIPATH.STAFF_UPD + this.id
  //   this.postService.doPutInq(url, this.dataObj).subscribe((res: any) => {
  //     console.log(res);
  //     this.snackbar.open(res.message, 'Dismiss', { duration: 3000 });
  //     this.location.back();
  //   })
  // }


  // staffInq() {
  //   this.id = this.route.snapshot.paramMap.get('id');
  //   if (this.id != 'cre') {
  //     let url = APIPATH.STAFF_INQ + this.id
  //     this.postService.doGetInq(url).subscribe((res: any) => {
  //       this.dataObj = res.responseObject;

  //       if (this.dataObj) {
  //         this.dataObj.contactInfo.emailId = this.encryptservice.decrypt(this.dataObj.contactInfo.emailId) ?? '';
  //         this.dataObj.emergencyContactInfo.mobile = this.encryptservice.decrypt(this.dataObj.emergencyContactInfo.mobile) ?? '';
  //         this.dataObj.contactInfo.primaryMobile = this.encryptservice.decrypt(this.dataObj.contactInfo.primaryMobile) ?? '';
  //         this.dataObj.contactInfo.secondaryMoblie = this.encryptservice.decrypt(this.dataObj.contactInfo.secondaryMoblie) ?? '';

  //         if (this.dataObj.documents.uploadProfile) {
  //           this.uploadDocPath = this.dataObj.documents.uploadProfile;
  //           this.uploadDocName = this.dataObj.documents.uploadProfile;
  //         }

  //         if (this.dataObj.documents.profileSummary) {
  //           this.profilesummaryDocPath = this.dataObj.documents.profileSummary;
  //           this.profileSummaryDocName = this.dataObj.documents.profileSummary;
  //         }

  //         if (this.dataObj.documents.identityProof) {
  //           this.docIdentityProofPath = this.dataObj.documents.identityProof;
  //           this.docIdentityName = this.dataObj.documents.identityProof;
  //         }

  //         if (this.dataObj.documents.educationProof) {
  //           this.educationDocPath = this.dataObj.documents.educationProof;
  //           this.educationDocName = this.dataObj.documents.educationProof;
  //         }
  //         if (this.dataObj.documents.qualificationProof) {
  //           this.qualificationDocPath = this.dataObj.documents.qualificationProof;
  //           this.qualificationDocName = this.dataObj.documents.qualificationProof;
  //         }
  //         if (this.dataObj.documents.certificationProof) {
  //           this.certificationDocPath = this.dataObj.documents.certificationProof;
  //           this.certificationDocName = this.dataObj.documents.certificationProof;
  //         }
  //         if (this.dataObj.documents.others) {
  //           this.otherDocPath = this.dataObj.documents.others;
  //           this.otherDocName = this.dataObj.documents.others;
  //         }
  //       }
  //       console.log(this.dataObj);
  //     }, err => {
  //       console.error('Error fetching resident details:', err);
  //     });
  //   }
  // }

  goToNextTab() {
    if (this.selectedTabIndex < 6) {
      this.selectedTabIndex += 1;
    }
  }

  backToMain() {
    this.location.back();
  }

  //SHIFT TIME CHANGE
  onShiftChange(selectedShift: string) {

    switch (selectedShift) {
      case 'FIRSTSHIFT':
        this.shiftStartTimes = '08:00';
        this.shiftEndTimes = '16:00';
        break;

      case 'SECONDSHIFT':
        this.shiftStartTimes = '16:00';
        this.shiftEndTimes = '12:00';
        break;

      case 'THIRDSHIFT':
        this.shiftStartTimes = '12:00';
        this.shiftEndTimes = '08:00';
        break;
    }
  }

  //CHANGE INTO CAPITAL LETTERS
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  //ADDRESS CHECKBOX
  copyPermanentAddress(event: any) {
    if (event.checked === true) {
      this.dataObj.currentAddress = { ...this.dataObj.permanentAddress };
    } else {
      this.dataObj.currentAddress = new CurrentAddress();
    }
    this.cdr.detectChanges();
  }

  onFileChange(event: any, documentType: string) {
    this.file = event.target.files[0];
    if (this.file) {
      if (this.file.size > 5 * 1024 * 1024) {
        this.fileSizeError = true;
        this.fileTypeError = false;
      } else {
        this.fileSizeError = false;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(this.file.type)) {
        this.fileTypeError = true;
      } else {
        this.fileTypeError = false;
      }
      const formData = new FormData();
      formData.append('file', this.file);
      // formData.append('id', this.encryptservice.encrypt(this.dataObj.contactInfo.emailId));
      // formData.append('legalDocType', "AADHAR")
      // this.postService.uploadDoc(APIPATH.COMMUNITY_FILE_UPLOAD, formData).subscribe((res: any) => {
      //   if (res.success && res.responseObject) {
      //     switch (documentType) {
      //       case 'uploadProfile':
      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           this.dataObj.documents.uploadProfile = res.responseObject;
      //         } else {
      //           this.dataObj.documents.uploadProfile = res.responseObject;
      //         }
      //         break;
      //       case 'profileSummary':
      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           this.dataObj.documents.profileSummary = res.responseObject;
      //         } else {
      //           this.dataObj.documents.profileSummary = res.responseObject;
      //         }
      //         break;
      //       case 'identityProof':
      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           this.dataObj.documents.identityProof = res.responseObject;
      //         } else {
      //           this.dataObj.documents.identityProof = res.responseObject;
      //         }
      //         break;
      //       case 'educationProof':
      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           this.dataObj.documents.educationProof = res.responseObject;
      //         } else {
      //           this.dataObj.documents.educationProof = res.responseObject;
      //         }
      //         break;
      //       case 'qualificationProof':
      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           this.dataObj.documents.qualificationProof = res.responseObject;
      //         } else {
      //           this.dataObj.documents.qualificationProof = res.responseObject;
      //         }
      //         break;
      //       case 'certificationProof':
      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           this.dataObj.documents.certificationProof = res.responseObject;
      //         } else {
      //           this.dataObj.documents.certificationProof = res.responseObject;
      //         }
      //         break;
      //       case 'others':

      //         if (!this.dataObj.documents) {
      //           this.dataObj.documents = new Documents();
      //           if (!this.dataObj.documents.others) {
      //             this.dataObj.documents.others = new Array<DocumentData>();
      //             this.dataObj.documents.others.push(res.responseObject);
      //           }
      //         } else {
      //           if (!this.dataObj.documents.others) {
      //             this.dataObj.documents.others = new Array<DocumentData>();
      //             this.dataObj.documents.others.push(res.responseObject);
      //           } else {
      //             this.dataObj.documents.others.push(res.responseObject);
      //           }
      //         }
      //         break;
      //       default:

      //         break;
      //     }
      //   } else {

      //     console.error('File upload failed');
      //   }
      // }, err => {
      //   console.error('Error uploading file:', err);
      // });

    }
  }

  deleteDocument(documentType: string, documentObj?: any) {
    if (!this.dataObj.documents) return;

    switch (documentType) {
      case 'uploadProfile':
        this.dataObj.documents.uploadProfile = new DocumentData();
        break;
      case 'profileSummary':
        this.dataObj.documents.profileSummary = new DocumentData();
        break;
      case 'identityProof':
        this.dataObj.documents.identityProof = new DocumentData();
        break;
      case 'educationProof':
        this.dataObj.documents.educationProof = new DocumentData();
        break;
      case 'qualificationProof':
        this.dataObj.documents.qualificationProof = new DocumentData();
        break;
      case 'certificationProof':
        this.dataObj.documents.certificationProof = new DocumentData();
        break;
      case 'others':
        if (this.dataObj.documents.others) {
          const index = this.dataObj.documents.others.indexOf(documentObj);
          if (index > -1) {
            this.dataObj.documents.others.splice(index, 1);
          }
        }
        break;
      default:
        console.error('Invalid document type');
        break;
    }
  }
}





export class PersonalInformation {
  firstName!: string;
  middleName!: string;
  lastName!: string;
  dateOfBirth!: string;
  gender!: string;
}

export class ContactInfo {
  emailId!: string;
  primaryMobile!: string;
  secondaryMoblie!: string;

}
export class EmergencyContactInfo {
  firstName!: string;
  lastName!: string;
  middleName!: string;
  mobile!: string;
  relation!: string;

}

export class PermanentAddress {
  addressline1!: string;
  city!: string;
  state!: string;
  country!: string;
  zipcode!: string;
}

export class CurrentAddress {
  addressline1!: string;
  city!: string;
  state!: string;
  country!: string;
  zipcode!: string;
}

export class EmploymentDetails {
  role!: string;
  department!: string;
  employmentType!: string;
  description!: string;
  startDate!: string;
}
export class ShiftDetails {
  shiftType!: string;
  shiftStartTime!: string;
  shiftEndTime!: string;
  shiftStartDate!: string;
  shiftEndDate!: string;
  location!: string;
}
export class Skills {
  languages!: string;
  technicalskills!: Array<string>;
  constructor() {
    this.technicalskills = new Array<string>();
  }
}
export class WorkExperience {
  jobTitle!: string;
  department!: string;
  startDate!: string;
  endDate!: string;
}
export class BankDetails {
  pan!: string;
  bankName!: string;
  branch!: string;
  ifscCode!: string;
  accountType!: string;
  accountNumber!: string;
}

export class Documents {
  uploadProfile!: DocumentData;
  profileSummary!: DocumentData;
  identityProof!: DocumentData;
  educationProof!: DocumentData;
  qualificationProof!: DocumentData;
  certificationProof!: DocumentData;
  others!: Array<DocumentData>;
}
export class DocumentData {
  documentId!: string;
  documentName!: string;
  documentType!: string;
  size!: string;
  documentPath!: string;
}


export class staffDetails {
  id!: string;
  staffId!: string;
  personalInformation!: PersonalInformation;
  contactInfo!: ContactInfo;
  emergencyContactInfo!: EmergencyContactInfo;
  permanentAddress!: PermanentAddress;
  currentAddress!: CurrentAddress;
  employmentDetails!: EmploymentDetails;
  shiftDetails!: ShiftDetails;
  skills!: Skills;
  workExperience!: WorkExperience;
  bankDetails!: BankDetails;
  documents!: Documents;
  constructor() {
    this.personalInformation = new PersonalInformation();
    this.contactInfo = new ContactInfo();
    this.emergencyContactInfo = new EmergencyContactInfo();
    this.permanentAddress = new PermanentAddress();
    this.currentAddress = new CurrentAddress();
    this.employmentDetails = new EmploymentDetails();
    this.shiftDetails = new ShiftDetails();
    this.workExperience = new WorkExperience();
    this.bankDetails = new BankDetails();
    this.skills = new Skills();
  }
}
