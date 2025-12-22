import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tenant-management-modal',
  templateUrl: './tenant-management-modal.component.html',
  styleUrls: ['./tenant-management-modal.component.scss']
})
export class TenantManagementModalComponent implements OnInit {
  tenant: any = {
    fullName: '',
    email: '',
    phone: '',
    roomNumber: '',
    checkinDate: null,
    status: 'Active',
    monthlyRent: null,
    securityDeposit: null,
    emergencyContact: '',
    occupation: '',
    idProofType: '',
    idProofFile: null,
    address: ''
  };

  // Screen detection
  isMobileOrTablet: boolean = false;
  private readonly TABLET_BREAKPOINT = 1024;

  // Camera related
  showCameraPreview: boolean = false;
  videoStream: MediaStream | null = null;
  capturedImageUrl: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TenantManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.tenant) {
      this.tenant = { ...data.tenant };
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobileOrTablet = window.innerWidth <= this.TABLET_BREAKPOINT;
  }

  onCancel(): void {
    this.stopCamera();
    this.dialogRef.close();
  }

  onSave(): void {
    const result = { ...this.tenant };

    if (result.checkinDate instanceof Date) {
      result.checkinDate = result.checkinDate.toISOString().split('T')[0];
    }

    this.stopCamera();
    this.dialogRef.close(result);
  }

  onIdProofTypeChange(): void {
    this.tenant.idProofFile = null;
    this.capturedImageUrl = null;
    this.stopCamera();
  }

  // ===== File Upload Methods =====
  onIdFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      this.tenant.idProofFile = file;
      this.capturedImageUrl = null;
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        this.createImagePreview(file);
      }
    } else if (file) {
      alert('File size must be under 5MB');
    }
    // Reset input
    event.target.value = '';
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.capturedImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeIdProof(): void {
    this.tenant.idProofFile = null;
    this.capturedImageUrl = null;
    this.stopCamera();
  }

  downloadFile(file: File): void {
    if (this.capturedImageUrl && !file) {
      // Download captured image
      const a = document.createElement('a');
      a.href = this.capturedImageUrl;
      a.download = `${this.tenant.idProofType?.replace(/\s/g, '_')}_capture.jpg`;
      a.click();
    } else if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ===== Camera Capture Methods =====
  async openCamera(): Promise<void> {
    try {
      this.showCameraPreview = true;
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Wait for DOM to update
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
    const canvas = document.createElement('canvas');
    
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob and create file
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `${this.tenant.idProofType?.replace(/\s/g, '_')}_${Date.now()}.jpg`;
            this.tenant.idProofFile = new File([blob], fileName, { type: 'image/jpeg' });
            this.capturedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
            this.stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
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
    // Toggle between front and back camera
    setTimeout(() => this.openCamera(), 300);
  }

  // Native camera capture (fallback for devices that don't support MediaDevices)
  onNativeCameraCapture(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        this.tenant.idProofFile = file;
        this.createImagePreview(file);
      } else {
        alert('File size must be under 5MB');
      }
    }
    event.target.value = '';
  }

  // Check if camera is available
  get isCameraAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}