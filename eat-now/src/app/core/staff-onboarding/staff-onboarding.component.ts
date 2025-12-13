import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

// Interfaces
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName: string;
}

export interface Document {
  type: string;
  number: string;
  file?: File;
  fileName?: string;
  verified: boolean;
}

export interface WorkSchedule {
  day: string;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

export interface StaffDetails {
  id?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  dateOfBirth: Date | null;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  profilePhotoUrl?: string;

  currentAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  permanentAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  sameAsCurrentAddress: boolean;

  department: string;
  designation: string;
  role: string;
  employmentType: string;
  joiningDate: Date | null;
  reportingTo: string;
  assignedFloors: string[];
  assignedShift: string;

  basicSalary: number | null;
  allowances: number | null;
  deductions: number | null;
  netSalary: number | null;
  paymentFrequency: string;

  bankDetails: BankDetails;
  documents: Document[];
  emergencyContacts: EmergencyContact[];
  workSchedule: WorkSchedule[];

  skills: string[];
  languages: string[];
  notes: string;
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-staff-onboarding',
  templateUrl: './staff-onboarding.component.html',
  styleUrls: ['./staff-onboarding.component.scss']
})
export class StaffOnboardingComponent implements OnInit, OnDestroy {
  staffForm!: FormGroup;
  isEditMode = false;
  staffId: string | null = null;
  currentStep = 0;
  isLoading = false;
  isSaving = false;
  profilePhotoPreview: string | null = null;

  // Dropdown Options
  departments = [
    'Administration',
    'Housekeeping',
    'Security',
    'Maintenance',
    'Kitchen',
    'Front Desk',
    'Accounts',
    'IT Support',
    'Management'
  ];

  designations = [
    'Manager',
    'Assistant Manager',
    'Supervisor',
    'Senior Executive',
    'Executive',
    'Trainee',
    'Helper',
    'Guard',
    'Cook',
    'Cleaner',
    'Receptionist',
    'Accountant',
    'Warden'
  ];

  roles = [
    'Admin',
    'Manager',
    'Staff',
    'Supervisor',
    'Viewer'
  ];

  employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Intern'
  ];

  genders = ['Male', 'Female', 'Other'];

  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  shifts = [
    { name: 'Morning Shift', time: '6:00 AM - 2:00 PM' },
    { name: 'Afternoon Shift', time: '2:00 PM - 10:00 PM' },
    { name: 'Night Shift', time: '10:00 PM - 6:00 AM' },
    { name: 'General Shift', time: '9:00 AM - 6:00 PM' },
    { name: 'Rotational', time: 'As per roster' }
  ];

  paymentFrequencies = ['Monthly', 'Weekly', 'Bi-weekly'];

  documentTypes = [
    'Aadhar Card',
    'PAN Card',
    'Voter ID',
    'Driving License',
    'Passport',
    'Educational Certificate',
    'Experience Letter',
    'Police Verification',
    'Medical Certificate',
    'Address Proof'
  ];

  relationships = [
    'Father',
    'Mother',
    'Spouse',
    'Brother',
    'Sister',
    'Son',
    'Daughter',
    'Friend',
    'Other'
  ];

  statuses = ['Active', 'On Leave', 'Suspended', 'Resigned', 'Terminated'];

  floors: string[] = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];
  
  managers: any[] = [
    { id: '1', name: 'John Doe', designation: 'Manager' },
    { id: '2', name: 'Jane Smith', designation: 'Supervisor' }
  ];

  skillOptions: string[] = [
    'Cleaning',
    'Cooking',
    'Customer Service',
    'Computer Skills',
    'Communication',
    'First Aid',
    'Plumbing',
    'Electrical Work',
    'Gardening',
    'Driving',
    'Accounting',
    'Management'
  ];

  languageOptions: string[] = [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Kannada',
    'Malayalam',
    'Marathi',
    'Bengali',
    'Gujarati',
    'Punjabi'
  ];

  weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  steps = [
    { label: 'Personal Info', icon: 'bi-person' },
    { label: 'Address', icon: 'bi-geo-alt' },
    { label: 'Employment', icon: 'bi-briefcase' },
    { label: 'Salary & Bank', icon: 'bi-wallet2' },
    { label: 'Documents', icon: 'bi-file-earmark-text' },
    { label: 'Schedule & Others', icon: 'bi-calendar-check' }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.staffId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.staffId;
    
    this.initializeForm();
    
    if (this.isEditMode && this.staffId) {
      this.loadStaffData(this.staffId);
    }
    
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForm(): void {
    this.staffForm = this.fb.group({
      // Personal Information
      employeeId: [{ value: this.generateEmployeeId(), disabled: true }],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      alternatePhone: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      dateOfBirth: [null, Validators.required],
      gender: ['', Validators.required],
      maritalStatus: [''],
      bloodGroup: [''],

      // Address Information
      currentAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        country: ['India']
      }),
      permanentAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        pincode: ['', [Validators.pattern(/^\d{6}$/)]],
        country: ['India']
      }),
      sameAsCurrentAddress: [false],

      // Employment Details
      department: ['', Validators.required],
      designation: ['', Validators.required],
      role: ['Staff', Validators.required],
      employmentType: ['Full-time', Validators.required],
      joiningDate: [new Date(), Validators.required],
      reportingTo: [''],
      assignedFloors: [[]],
      assignedShift: ['General Shift'],

      // Salary & Compensation
      basicSalary: [null, [Validators.required, Validators.min(0)]],
      allowances: [0, Validators.min(0)],
      deductions: [0, Validators.min(0)],
      netSalary: [{ value: null, disabled: true }],
      paymentFrequency: ['Monthly'],

      // Bank Details
      bankDetails: this.fb.group({
        accountHolderName: [''],
        accountNumber: ['', [Validators.pattern(/^\d{9,18}$/)]],
        bankName: [''],
        ifscCode: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
        branchName: ['']
      }),

      // Documents
      documents: this.fb.array([]),

      // Emergency Contacts
      emergencyContacts: this.fb.array([this.createEmergencyContactGroup()]),

      // Work Schedule
      workSchedule: this.fb.array(this.initializeWorkSchedule()),

      // Additional Information
      skills: [[]],
      languages: [[]],
      notes: [''],
      status: ['Active']
    });
  }

  private loadStaffData(id: string): void {
    this.isLoading = true;
    // Simulate API call - Replace with actual service call
    setTimeout(() => {
      // Mock data for edit mode
      const mockStaff: Partial<StaffDetails> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        gender: 'Male',
        department: 'Housekeeping',
        designation: 'Supervisor',
        status: 'Active'
      };
      this.staffForm.patchValue(mockStaff);
      this.isLoading = false;
    }, 1000);
  }

  private createEmergencyContactGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });
  }

  private createDocumentGroup(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      number: ['', Validators.required],
      fileName: [''],
      verified: [false]
    });
  }

  private initializeWorkSchedule(): FormGroup[] {
    return this.weekDays.map(day => {
      return this.fb.group({
        day: [day],
        isWorking: [day !== 'Sunday'],
        startTime: ['09:00'],
        endTime: ['18:00']
      });
    });
  }

  private setupFormListeners(): void {
    // Calculate net salary
    const salaryFields = ['basicSalary', 'allowances', 'deductions'];
    salaryFields.forEach(field => {
      const sub = this.staffForm.get(field)?.valueChanges.subscribe(() => {
        this.calculateNetSalary();
      });
      if (sub) this.subscriptions.push(sub);
    });

    // Same as current address
    const addressSub = this.staffForm.get('sameAsCurrentAddress')?.valueChanges.subscribe(same => {
      if (same) {
        const currentAddress = this.staffForm.get('currentAddress')?.value;
        this.staffForm.get('permanentAddress')?.patchValue(currentAddress);
        this.staffForm.get('permanentAddress')?.disable();
      } else {
        this.staffForm.get('permanentAddress')?.enable();
      }
    });
    if (addressSub) this.subscriptions.push(addressSub);
  }

  private calculateNetSalary(): void {
    const basic = this.staffForm.get('basicSalary')?.value || 0;
    const allowances = this.staffForm.get('allowances')?.value || 0;
    const deductions = this.staffForm.get('deductions')?.value || 0;
    const netSalary = basic + allowances - deductions;
    this.staffForm.get('netSalary')?.setValue(netSalary);
  }

  private generateEmployeeId(): string {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Form Array Getters
  get emergencyContacts(): FormArray {
    return this.staffForm.get('emergencyContacts') as FormArray;
  }

  get documents(): FormArray {
    return this.staffForm.get('documents') as FormArray;
  }

  get workSchedule(): FormArray {
    return this.staffForm.get('workSchedule') as FormArray;
  }

  // Emergency Contact Methods
  addEmergencyContact(): void {
    if (this.emergencyContacts.length < 3) {
      this.emergencyContacts.push(this.createEmergencyContactGroup());
    } else {
      this.showSnackBar('Maximum 3 emergency contacts allowed', 'warning');
    }
  }

  removeEmergencyContact(index: number): void {
    if (this.emergencyContacts.length > 1) {
      this.emergencyContacts.removeAt(index);
    } else {
      this.showSnackBar('At least one emergency contact is required', 'warning');
    }
  }

  // Document Methods
  addDocument(): void {
    this.documents.push(this.createDocumentGroup());
  }

  removeDocument(index: number): void {
    this.documents.removeAt(index);
  }

  onDocumentFileSelect(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        this.showSnackBar('File size should not exceed 5MB', 'error');
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.showSnackBar('Only PDF, JPG, and PNG files are allowed', 'error');
        return;
      }

      this.documents.at(index).patchValue({ fileName: file.name });
    }
  }

  // Profile Photo Methods
  onProfilePhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSize) {
        this.showSnackBar('Profile photo should not exceed 2MB', 'error');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.showSnackBar('Only JPG and PNG files are allowed', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePhoto(): void {
    this.profilePhotoPreview = null;
  }

  // Navigation Methods
  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.scrollToTop();
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.scrollToTop();
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
      this.scrollToTop();
      return;
    }

    for (let i = this.currentStep; i < step; i++) {
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        return;
      }
    }
    this.currentStep = step;
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private validateCurrentStep(): boolean {
    let isValid = true;
    let errorMessage = '';

    switch (this.currentStep) {
      case 0: // Personal Info
        const personalFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'];
        personalFields.forEach(field => {
          const control = this.staffForm.get(field);
          if (control?.invalid) {
            control.markAsTouched();
            isValid = false;
          }
        });
        if (!isValid) errorMessage = 'Please fill all required personal information';
        break;

      case 1: // Address
        const currentAddressGroup = this.staffForm.get('currentAddress') as FormGroup;
        Object.keys(currentAddressGroup.controls).forEach(key => {
          const control = currentAddressGroup.get(key);
          if (control?.invalid) {
            control.markAsTouched();
            isValid = false;
          }
        });
        if (!isValid) errorMessage = 'Please fill all required address fields';
        break;

      case 2: // Employment
        const employmentFields = ['department', 'designation', 'role', 'employmentType', 'joiningDate'];
        employmentFields.forEach(field => {
          const control = this.staffForm.get(field);
          if (control?.invalid) {
            control.markAsTouched();
            isValid = false;
          }
        });
        if (!isValid) errorMessage = 'Please fill all required employment details';
        break;

      case 3: // Salary & Bank
        const salaryControl = this.staffForm.get('basicSalary');
        if (salaryControl?.invalid) {
          salaryControl.markAsTouched();
          isValid = false;
          errorMessage = 'Please enter valid salary details';
        }
        break;

      case 4: // Documents
        for (let i = 0; i < this.documents.length; i++) {
          const doc = this.documents.at(i);
          if (doc.invalid) {
            doc.markAllAsTouched();
            isValid = false;
            errorMessage = 'Please complete all document details';
            break;
          }
        }
        break;

      case 5: // Schedule & Others
        for (let i = 0; i < this.emergencyContacts.length; i++) {
          const contact = this.emergencyContacts.at(i);
          if (contact.invalid) {
            contact.markAllAsTouched();
            isValid = false;
            errorMessage = 'Please complete all emergency contact details';
            break;
          }
        }
        break;
    }

    if (!isValid && errorMessage) {
      this.showSnackBar(errorMessage, 'error');
    }

    return isValid;
  }

  // Skill & Language Toggle
  toggleSkill(skill: string): void {
    const skills = this.staffForm.get('skills')?.value || [];
    const index = skills.indexOf(skill);
    if (index > -1) {
      skills.splice(index, 1);
    } else {
      skills.push(skill);
    }
    this.staffForm.get('skills')?.setValue([...skills]);
  }

  isSkillSelected(skill: string): boolean {
    const skills = this.staffForm.get('skills')?.value || [];
    return skills.includes(skill);
  }

  toggleLanguage(language: string): void {
    const languages = this.staffForm.get('languages')?.value || [];
    const index = languages.indexOf(language);
    if (index > -1) {
      languages.splice(index, 1);
    } else {
      languages.push(language);
    }
    this.staffForm.get('languages')?.setValue([...languages]);
  }

  isLanguageSelected(language: string): boolean {
    const languages = this.staffForm.get('languages')?.value || [];
    return languages.includes(language);
  }

  // Calculate Age
  calculateAge(): number | null {
    const dob = this.staffForm.get('dateOfBirth')?.value;
    if (!dob) return null;

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  // Form Actions
  goBack(): void {
    this.location.back();
  }

  onSave(): void {
    // Validate all steps
    for (let i = 0; i < this.steps.length; i++) {
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        return;
      }
    }

    if (this.staffForm.valid) {
      this.isSaving = true;
      const formData = this.staffForm.getRawValue();

      const staffData: StaffDetails = {
        ...formData,
        profilePhotoUrl: this.profilePhotoPreview,
        createdAt: this.isEditMode ? undefined : new Date(),
        updatedAt: new Date()
      };

      // Simulate API call - Replace with actual service call
      setTimeout(() => {
        this.isSaving = false;
        this.showSnackBar(
          this.isEditMode ? 'Staff updated successfully!' : 'Staff onboarded successfully!',
          'success'
        );
        this.router.navigate(['/staff']);
      }, 1500);
    } else {
      this.showSnackBar('Please fill all required fields correctly', 'error');
    }
  }

  onSaveAsDraft(): void {
    this.isSaving = true;
    const formData = this.staffForm.getRawValue();
    const staffData = {
      ...formData,
      status: 'Draft',
      profilePhotoUrl: this.profilePhotoPreview
    };

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.showSnackBar('Staff saved as draft', 'success');
      this.router.navigate(['/staff']);
    }, 1000);
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  // Helper Methods
  getStepStatus(stepIndex: number): string {
    if (stepIndex < this.currentStep) {
      return 'completed';
    } else if (stepIndex === this.currentStep) {
      return 'active';
    }
    return 'pending';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  getFormControl(name: string) {
    return this.staffForm.get(name);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.staffForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }
}