import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnnouncementType, Priority, TargetAudience, Announcement } from '../../common-library/model';
import { AnnouncementsService } from '../../shared/services/announcements.service';



export interface DialogData {
  announcement?: Announcement;
  isEdit: boolean;
}

@Component({
  selector: 'app-announcements-modal',
  templateUrl: './announcements-modal.component.html',
  styleUrl: './announcements-modal.component.scss'
})
export class AnnouncementsModalComponent implements OnInit {
  announcementForm!: FormGroup;
  isEdit: boolean = false;
  isLoading: boolean = false;
  
  rooms: string[] = [];
  floors: string[] = [];
  
  announcementTypes = [
    { value: AnnouncementType.GENERAL, label: 'General', icon: 'bi-info-circle' },
    { value: AnnouncementType.MAINTENANCE, label: 'Maintenance', icon: 'bi-tools' },
    { value: AnnouncementType.EMERGENCY, label: 'Emergency', icon: 'bi-exclamation-triangle' },
    { value: AnnouncementType.EVENT, label: 'Event', icon: 'bi-calendar-event' },
    { value: AnnouncementType.PAYMENT, label: 'Payment', icon: 'bi-credit-card' },
    { value: AnnouncementType.RULES, label: 'Rules & Regulations', icon: 'bi-journal-text' }
  ];
  
  priorities = [
    { value: Priority.LOW, label: 'Low', color: 'success' },
    { value: Priority.MEDIUM, label: 'Medium', color: 'info' },
    { value: Priority.HIGH, label: 'High', color: 'warning' },
    { value: Priority.URGENT, label: 'Urgent', color: 'danger' }
  ];
  
  targetAudiences = [
    { value: TargetAudience.ALL, label: 'All Tenants', icon: 'bi-people' },
    { value: TargetAudience.SPECIFIC_ROOMS, label: 'Specific Rooms', icon: 'bi-door-open' },
    { value: TargetAudience.SPECIFIC_FLOORS, label: 'Specific Floors', icon: 'bi-building' },
    { value: TargetAudience.NEW_TENANTS, label: 'New Tenants Only', icon: 'bi-person-plus' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AnnouncementsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private announcementService:AnnouncementsService
  ) {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadRoomsAndFloors();
    
    if (this.isEdit && this.data.announcement) {
      this.populateForm(this.data.announcement);
    }
  }

  initForm(): void {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      type: [AnnouncementType.GENERAL, Validators.required],
      priority: [Priority.MEDIUM, Validators.required],
      targetAudience: [TargetAudience.ALL, Validators.required],
      targetRooms: [[]],
      targetFloors: [[]],
      expiryDate: [null],
      isActive: [true]
    });

    // Watch for target audience changes
    this.announcementForm.get('targetAudience')?.valueChanges.subscribe(value => {
      this.onTargetAudienceChange(value);
    });
  }

  loadRoomsAndFloors(): void {
    this.announcementService.getRooms().subscribe(rooms => this.rooms = rooms);
    this.announcementService.getFloors().subscribe(floors => this.floors = floors);
  }

  populateForm(announcement: Announcement): void {
    this.announcementForm.patchValue({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      targetRooms: announcement.targetRooms || [],
      targetFloors: announcement.targetFloors || [],
      expiryDate: announcement.expiryDate,
      isActive: announcement.isActive
    });
  }

  onTargetAudienceChange(value: TargetAudience): void {
    if (value !== TargetAudience.SPECIFIC_ROOMS) {
      this.announcementForm.get('targetRooms')?.setValue([]);
    }
    if (value !== TargetAudience.SPECIFIC_FLOORS) {
      this.announcementForm.get('targetFloors')?.setValue([]);
    }
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      this.isLoading = true;
      const formData = this.announcementForm.value;
      
      if (this.isEdit && this.data.announcement) {
        this.announcementService.updateAnnouncement(this.data.announcement.id, formData)
          .subscribe({
            next: (result) => {
              this.isLoading = false;
              this.dialogRef.close({ success: true, data: result });
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error updating announcement:', error);
            }
          });
      } else {
        this.announcementService.createAnnouncement(formData)
          .subscribe({
            next: (result) => {
              this.isLoading = false;
              this.dialogRef.close({ success: true, data: result });
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error creating announcement:', error);
            }
          });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.announcementForm.controls).forEach(key => {
      this.announcementForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

  get f() {
    return this.announcementForm.controls;
  }
}
