import { Component, ElementRef, Inject, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceService } from '../../shared/services/maintenance.service';

export interface MaintenanceIssue {
  tenantName: string;
  roomNumber: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  imageFile?: File;
  imagePreview?: string;
  imageName?: string;
}

@Component({
  selector: 'app-maintenance-management-modal',
  templateUrl: './maintenance-management-modal.component.html',
  styleUrls: ['./maintenance-management-modal.component.scss']
})
export class MaintenanceManagementModalComponent implements OnInit, OnDestroy {

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
  priorities: string[] = ['Low', 'Medium', 'High'];
  isSubmitting = false;

  // ===== Screen Detection =====
  isMobileOrTablet: boolean = false;
  private readonly TABLET_BREAKPOINT = 1024;

  // ===== Camera Related =====
  showCameraPreview: boolean = false;
  videoStream: MediaStream | null = null;
  capturedImageUrl: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<MaintenanceManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { issue?: MaintenanceIssue },
    private cfg: MaintenanceService
  ) {
    if (data?.issue) {
      this.issue = { ...data.issue };
      if (data.issue.imagePreview) {
        this.capturedImageUrl = data.issue.imagePreview;
      }
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
    
    this.cfg.config$.subscribe(c => {
      this.categories = c.categories || ['Electrical', 'Plumbing', 'Carpentry', 'Network', 'Cleaning', 'Other'];
      this.priorities = c.priorities || ['Low', 'Medium', 'High'];

      if (this.issue.category && !this.categories.includes(this.issue.category)) {
        this.issue.category = '';
      }
      if (this.issue.priority && !this.priorities.includes(this.issue.priority)) {
        this.issue.priority = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobileOrTablet = window.innerWidth <= this.TABLET_BREAKPOINT;
  }

  // ===== File Upload Methods =====
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file: File = input.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
      this.issue.imageFile = file;
      this.issue.imageName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.issue.imagePreview = e.target.result;
        this.capturedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file under 10MB.');
      input.value = '';
    }
    // Reset input
    input.value = '';
  }

  removeImage(): void {
    this.issue.imageFile = undefined;
    this.issue.imagePreview = '';
    this.issue.imageName = '';
    this.capturedImageUrl = null;
    this.stopCamera();

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  downloadImage(): void {
    if (!this.issue.imagePreview) return;

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

  // ===== Camera Capture Methods =====
  async openCamera(): Promise<void> {
    try {
      this.showCameraPreview = true;
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setTimeout(() => {
        const video = document.getElementById('cameraPreview') as HTMLVideoElement;
        if (video) {
          video.srcObject = this.videoStream;
          video.play();
        }
      }, 100);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Unable to access camera. Please check permissions.');
      this.showCameraPreview = false;
    }
  }

  captureImage(): void {
    const video = document.getElementById('cameraPreview') as HTMLVideoElement;
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const fileName = `damage_capture_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      this.issue.imageFile = file;
      this.issue.imageName = fileName;
      this.issue.imagePreview = imageUrl;
      this.capturedImageUrl = imageUrl;

      // Hide camera only after preview is set
      this.stopCamera();
    }, 'image/jpeg', 0.9);
  }

  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    this.showCameraPreview = false;
  }

  switchCamera(): void {
    this.stopCamera();
    setTimeout(() => this.openCamera(), 300);
  }

  onNativeCameraCapture(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024 && file.type.startsWith('image/')) {
        this.issue.imageFile = file;
        this.issue.imageName = file.name;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.issue.imagePreview = e.target.result;
          this.capturedImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file under 10MB.');
      }
    }
    event.target.value = '';
  }

  get isCameraAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  get hasImage(): boolean {
    return !!(this.issue.imageFile || this.issue.imagePreview);
  }

  onCancel(): void {
    this.stopCamera();
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.issue.imageFile) {
      alert('Please upload a damage image.');
      return;
    }

    this.stopCamera();
    this.isSubmitting = true;
    setTimeout(() => {
      this.dialogRef.close(this.issue);
    }, 500);
  }
}