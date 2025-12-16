import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceService } from '../../shared/services/maintenance.service';

export interface MaintenanceIssue {
  tenantName: string;
  roomNumber: string;
  category: string;
  priority: string;
  title: string;
  description: string;

  imageFile?: File;         // Actual file
  imagePreview?: string;    // Base64 for preview
  imageName?: string;       // Original filename
}

@Component({
  selector: 'app-maintenance-management-modal',
  templateUrl: './maintenance-management-modal.component.html',
  styleUrl: './maintenance-management-modal.component.scss'
})
export class MaintenanceManagementModalComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  issue: MaintenanceIssue = {
    tenantName: '',
    roomNumber: '',
    category: '',
    priority: '',
    title: '',
    description: '',
    imageFile: undefined,
    imagePreview: '',
    imageName: ''
  };

  categories: string[] = [];
  priorities: string[] = ['Low', 'Medium', 'High']; // Fallback
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<MaintenanceManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { issue?: MaintenanceIssue },
    private cfg: MaintenanceService
  ) {
    if (data?.issue) {
      this.issue = { ...data.issue };
    }
  }

  ngOnInit(): void {
    this.cfg.config$.subscribe(c => {
      this.categories = c.categories || ['Electrical', 'Plumbing', 'Carpentry', 'Network', 'Cleaning', 'Other'];
      this.priorities = c.priorities || ['Low', 'Medium', 'High'];

      // Reset invalid selections on edit
      if (this.issue.category && !this.categories.includes(this.issue.category)) {
        this.issue.category = '';
      }
      if (this.issue.priority && !this.priorities.includes(this.issue.priority)) {
        this.issue.priority = '';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file: File = input.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) { // 10MB limit
      this.issue.imageFile = file;
      this.issue.imageName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.issue.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file under 10MB.');
      input.value = '';
    }
  }

  // FIXED: No parameter needed — uses @ViewChild
  removeImage(): void {
    this.issue.imageFile = undefined;
    this.issue.imagePreview = '';
    this.issue.imageName = '';

    // Clear the actual file input
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  downloadImage(): void {
    if (!this.issue.imageFile || !this.issue.imagePreview) return;

    const link = document.createElement('a');
    link.href = this.issue.imagePreview;
    link.download = this.issue.imageName || 'damage-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '0 KB';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSave(): void {
    if (!this.issue.imageFile) {
      alert('Please upload a damage image.');
      return;
    }

    this.isSubmitting = true;
    setTimeout(() => {
      this.dialogRef.close(this.issue);
    }, 500); // Simulate async save
  }
}