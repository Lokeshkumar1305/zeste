import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff-onboarding',
  templateUrl: './staff-onboarding.component.html',
  styleUrls: ['./staff-onboarding.component.scss']
})
export class StaffOnboardingComponent implements OnInit, OnDestroy {
  activeStep: number = 1;

  steps = [
    { id: 1, title: 'Identity', subtitle: 'Basic staff details', icon: 'bi bi-person-fill', status: 'active' },
    { id: 2, title: 'Contact', subtitle: 'Communication info', icon: 'bi bi-telephone-fill', status: 'pending' },
    { id: 3, title: 'Employment', subtitle: 'Work & Bank info', icon: 'bi bi-briefcase-fill', status: 'pending' },
    { id: 4, title: 'Address', subtitle: 'Location details', icon: 'bi bi-geo-alt-fill', status: 'pending' }
  ];

  staffForm!: FormGroup;
  isEditMode = false;
  staffId: string | null = null;
  isLoading = false;
  isSaving = false;
  profilePhotoPreview: string | null = null;

  hostelRoles = [
    'Hostel Warden',
    'Property Manager',
    'Caretaker',
    'Cook / Chef',
    'Security Guard',
    'Housekeeping Staff'
  ];

  employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract'
  ];

  genders = ['Male', 'Female', 'Other'];

  shifts = [
    { name: 'Day Shift', time: '8:00 AM - 8:00 PM' },
    { name: 'Night Shift', time: '8:00 PM - 8:00 AM' }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.staffId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.staffId;
    this.initializeForm();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForm(): void {
    this.staffForm = this.fb.group({
      // Identity
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: [null, Validators.required],
      gender: ['', Validators.required],
      aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],

      // Contact
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],

      // Employment
      role: ['', Validators.required],
      employmentType: ['Full-time', Validators.required],
      assignedShift: ['Day Shift', Validators.required],
      joiningDate: [new Date(), Validators.required],
      basicSalary: [null, [Validators.required, Validators.min(0)]],

      // Bank
      bankName: [''],
      accountNumber: [''],
      ifscCode: [''],

      // Address
      currentAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      }),
      permanentAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      }),
      sameAsCurrentAddress: [false]
    });
  }

  private setupFormListeners(): void {
    const addressSub = this.staffForm.get('sameAsCurrentAddress')?.valueChanges.subscribe(same => {
      if (same) {
        const current = this.staffForm.get('currentAddress')?.value;
        this.staffForm.get('permanentAddress')?.patchValue(current);
        this.staffForm.get('permanentAddress')?.disable();
      } else {
        this.staffForm.get('permanentAddress')?.enable();
      }
    });
    if (addressSub) this.subscriptions.push(addressSub);
  }

  // Navigation
  setStep(stepId: number) {
    if (stepId < this.activeStep || this.isStepValid(this.activeStep)) {
      this.activeStep = stepId;
      this.updateStepStatus();
    }
  }

  isStepValid(stepId: number): boolean {
    // Basic validation per step
    if (stepId === 1) {
      return this.staffForm.get('firstName')!.valid &&
        this.staffForm.get('lastName')!.valid &&
        this.staffForm.get('dateOfBirth')!.valid;
    }
    if (stepId === 2) {
      return this.staffForm.get('phone')!.valid &&
        this.staffForm.get('emergencyContactName')!.valid;
    }
    return true;
  }

  nextStep() {
    if (this.isStepValid(this.activeStep)) {
      if (this.activeStep < this.steps.length) {
        this.steps[this.activeStep - 1].status = 'completed';
        this.activeStep++;
        this.steps[this.activeStep - 1].status = 'active';
      } else {
        this.onSave();
      }
    } else {
      this.snackBar.open('Please complete required fields.', 'Close', { duration: 2000 });
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

  onSave(): void {
    if (this.staffForm.valid) {
      this.isSaving = true;
      setTimeout(() => {
        this.isSaving = false;
        this.snackBar.open('Staff onboarded successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/staff']);
      }, 1500);
    }
  }

  backToMain() {
    this.location.back();
  }

  onProfilePhotoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.profilePhotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }
}