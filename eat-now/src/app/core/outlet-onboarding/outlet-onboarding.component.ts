import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OPSMenu } from '../../shared/en-common-table/en-common-table.component';
import { Outlet, Owners } from '../../common-library/model';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../common-library/services/api.service';
import { APIPath } from '../../common-library/api-enum';
import { Subscription } from 'rxjs';
import { BedsService } from '../../shared/services/beds.service';
import { RoomConfigService } from '../../shared/services/room-config.service';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';
import { RoomManagementModalComponent } from '../room-management-modal/room-management-modal.component';
import { RoomType } from '../room-type-management/room-type-management.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HostelService } from '../../shared/services/hostel.service';


interface PhotoUpload {
  file: File;
  preview: string;
}

export interface RoomDetails {
  roomNumber: string;
  type: string;
  monthlyRent: number | null;
  securityDeposit: number | null;
  floor: string | null;
  beds: number | null;
  status: string;
  description: string;
  amenities: string[];
}

@Component({
  selector: 'app-outlet-onboarding',
  templateUrl: './outlet-onboarding.component.html',
  styleUrl: './outlet-onboarding.component.scss'
})

export class OutletOnboardingComponent implements OnInit {
  activeStep: number = 1;

  steps = [
    { id: 1, title: 'Owner Details', subtitle: 'Personal information', icon: 'bi bi-person-fill', status: 'active' },
    { id: 2, title: 'Hostel Details', subtitle: 'Basic hostel info', icon: 'bi bi-building-fill', status: 'pending' },
    { id: 3, title: 'License & Property', subtitle: 'Legal certifications', icon: 'bi bi-file-earmark-check-fill', status: 'pending' }
  ];

  ownerForm!: FormGroup;
  hostelForm!: FormGroup;
  licenseForm!: FormGroup;

  saving = false;
  hostelPhotos: PhotoUpload[] = [];
  fssaiDocument: File | null = null;

  indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public router: Router,
    private onboardingService: HostelService
  ) { }

  setStep(stepId: number) {
    if (stepId < this.activeStep || this.isStepValid(stepId - 1)) {
      this.activeStep = stepId;
      this.updateStepStatus();
    }
  }

  isStepValid(stepId: number): boolean {
    if (stepId === 1) return this.ownerForm.valid;
    if (stepId === 2) return this.hostelForm.valid;
    if (stepId === 3) return this.licenseForm.valid;
    return true;
  }

  nextStep() {
    if (this.isStepValid(this.activeStep)) {
      if (this.activeStep < this.steps.length) {
        this.steps[this.activeStep - 1].status = 'completed';
        this.activeStep++;
        this.steps[this.activeStep - 1].status = 'active';
      } else {
        // Submit logic
      }
    } else {
      this.snackBar.open('Please complete the current step.', 'Close', { duration: 2000 });
    }
  }

  prevStep() {
    if (this.activeStep > 1) {
      this.activeStep--;
      this.updateStepStatus();
    }
  }

  updateStepStatus() {
    this.steps.forEach(step => {
      if (step.id < this.activeStep) step.status = 'completed';
      else if (step.id === this.activeStep) step.status = 'active';
      else step.status = 'pending';
    });
  }

  ngOnInit(): void {
    this.initForms();
    this.loadDraft();
  }

  private initForms(): void {
    // Owner Form
    this.ownerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      alternatePhone: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      aadharNumber: ['', [Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}$/)]],
      panNumber: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]]
    });

    // Hostel Form
    this.hostelForm = this.fb.group({
      hostelName: ['', [Validators.required, Validators.minLength(3)]],
      hostelType: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      landmark: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      googleMapsLink: [''],
      contactEmail: ['', Validators.email]
    });

    // License Form
    this.licenseForm = this.fb.group({
      propertyType: ['', Validators.required],
      hasFoodLicense: [false],
      fssaiNumber: [''],
      fssaiDocument: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });

    // Enable/disable FSSAI fields based on toggle
    this.licenseForm.get('hasFoodLicense')?.valueChanges.subscribe(hasFoodLicense => {
      const fssaiNumberControl = this.licenseForm.get('fssaiNumber');
      if (hasFoodLicense) {
        fssaiNumberControl?.setValidators([Validators.pattern(/^\d{14}$/)]);
      } else {
        fssaiNumberControl?.clearValidators();
        fssaiNumberControl?.setValue('');
        this.fssaiDocument = null;
      }
      fssaiNumberControl?.updateValueAndValidity();
    });
  }

  // Photo Upload Methods
  onPhotosSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const remainingSlots = 5 - this.hostelPhotos.length;
      const filesToAdd = Array.from(input.files).slice(0, remainingSlots);

      filesToAdd.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            this.hostelPhotos.push({
              file: file,
              preview: e.target?.result as string
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
    input.value = '';
  }

  removePhoto(index: number): void {
    this.hostelPhotos.splice(index, 1);
  }

  // FSSAI Document Upload
  onFssaiDocSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fssaiDocument = input.files[0];
      this.licenseForm.patchValue({ fssaiDocument: this.fssaiDocument.name });
    }
  }

  // Form Validation
  canSubmit(): boolean {
    return this.ownerForm.valid &&
      this.hostelForm.valid &&
      this.licenseForm.valid;
  }

  // Save Draft
  saveDraft(): void {
    this.saving = true;
    const draftData = this.collectFormData();
    draftData.status = 'Draft';

    this.onboardingService.saveDraft(draftData).subscribe({
      next: () => {
        this.snackBar.open('Draft saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.saving = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to save draft. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.saving = false;
      }
    });
  }

  // Load Draft
  loadDraft(): void {
    this.onboardingService.getDraft().subscribe({
      next: (draft) => {
        if (draft) {
          this.populateForms(draft);
        }
      },
      error: () => {
        // No draft found, continue with empty form
      }
    });
  }

  private populateForms(data: any): void {
    if (data.ownerDetails) {
      this.ownerForm.patchValue(data.ownerDetails);
    }
    if (data.hostelDetails) {
      this.hostelForm.patchValue(data.hostelDetails);
    }
    if (data.licenseDetails) {
      this.licenseForm.patchValue(data.licenseDetails);
    }
  }

  // Submit Onboarding
  // submitOnboarding(): void {
  //   if (!this.canSubmit()) {
  //     this.snackBar.open('Please fill all required fields', 'Close', {
  //       duration: 3000,
  //       panelClass: ['error-snackbar']
  //     });
  //     return;
  //   }

  //   this.saving = true;
  //   const formData = this.collectFormData();
  //   formData.status = 'Submitted';

  //   // Create FormData for file upload
  //   const submitData = new FormData();
  //   submitData.append('data', JSON.stringify(formData));

  //   // Append photos
  //   this.hostelPhotos.forEach((photo, index) => {
  //     submitData.append(`photo_${index}`, photo.file);
  //   });

  //   // Append FSSAI document
  //   if (this.fssaiDocument) {
  //     submitData.append('fssaiDocument', this.fssaiDocument);
  //   }

  //   this.onboardingService.submitOnboarding(submitData).subscribe({
  //     next: (response) => {
  //       this.saving = false;
  //       this.showSuccessDialog();
  //     },
  //     error: (error) => {
  //       this.saving = false;
  //       this.snackBar.open('Failed to submit. Please try again.', 'Close', {
  //         duration: 3000,
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }

  private collectFormData(): any {
    return {
      ownerDetails: this.ownerForm.value,
      hostelDetails: this.hostelForm.value,
      licenseDetails: {
        propertyType: this.licenseForm.get('propertyType')?.value,
        hasFoodLicense: this.licenseForm.get('hasFoodLicense')?.value,
        fssaiNumber: this.licenseForm.get('fssaiNumber')?.value
      },
      termsAccepted: this.licenseForm.get('termsAccepted')?.value,
      status: 'Draft'
    };
  }

  private showSuccessDialog(): void {
    // You can create a custom dialog or use snackbar
    this.snackBar.open(
      '🎉 Hostel submitted successfully! We will review and get back to you within 24-48 hours.',
      'Close',
      {
        duration: 5000,
        panelClass: ['success-snackbar']
      }
    );
    this.router.navigate(['/dashboard']);
  }

  // Terms & Privacy
  openTerms(): void {
    window.open('/terms-and-conditions', '_blank');
  }

  openPrivacy(): void {
    window.open('/privacy-policy', '_blank');
  }
}