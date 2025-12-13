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
  priorities: string[] = [];
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
      this.categories = c.categories || [];
      this.priorities = c.priorities || [];

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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.issue.imageFile = file;
      this.issue.imageName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.issue.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(fileInput: HTMLInputElement): void {
    this.issue.imageFile = undefined;
    this.issue.imagePreview = '';
    this.issue.imageName = '';
    if (fileInput) {
      fileInput.value = '';
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

  onSave(): void {
    this.isSubmitting = true;
    this.dialogRef.close(this.issue);
  }
}