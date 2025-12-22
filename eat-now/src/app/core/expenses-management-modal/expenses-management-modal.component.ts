import { Component, Inject, ViewChild, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Expense {
  title: string;
  category: string;
  amount: number;
  date: Date | null;
  paymentMethod: string;
  vendor: string;
  receiptFile?: File;
  receiptFileName?: string;
  receiptUrl?: string;
  description: string;
  notes?: string;
}

@Component({
  selector: 'app-expenses-management-modal',
  templateUrl: './expenses-management-modal.component.html',
  styleUrls: ['./expenses-management-modal.component.scss']
})
export class ExpensesManagementModalComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  categories = ['Utilities', 'Rent', 'Supplies', 'Travel', 'Meals', 'Equipment', 'Marketing', 'Insurance', 'Taxes', 'Other'];
  paymentMethods = ['Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Cheque'];

  expense: Expense = {
    title: '',
    category: '',
    amount: 0,
    date: new Date(),
    paymentMethod: '',
    vendor: '',
    description: '',
    notes: ''
  };

  imagePreviewUrl: SafeUrl | null = null;
  isImage = false;
  attachmentName = '';
  attachmentSize: number = 0;

  // ===== Screen Detection =====
  isMobileOrTablet: boolean = false;
  private readonly TABLET_BREAKPOINT = 1024;

  // ===== Camera Related =====
  showCameraPreview: boolean = false;
  videoStream: MediaStream | null = null;
  capturedImageUrl: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ExpensesManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    if (data?.expense) {
      this.expense = { ...data.expense };
      if (typeof this.expense.date === 'string') {
        this.expense.date = new Date(this.expense.date);
      }
      if (data.expense.receiptUrl) {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(data.expense.receiptUrl);
        this.isImage = true;
        this.attachmentName = data.expense.receiptFileName || 'receipt';
      }
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
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
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB');
        return;
      }

      this.expense.receiptFile = file;
      this.expense.receiptFileName = file.name;
      this.attachmentName = file.name;
      this.attachmentSize = file.size;
      this.isImage = file.type.startsWith('image/');
      this.capturedImageUrl = null;

      this.updatePreview(file);
    }
    event.target.value = '';
  }

  private updatePreview(file: File): void {
    if (this.isImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        this.capturedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviewUrl = 'pdf';
      this.capturedImageUrl = null;
    }
  }

  removeFile(): void {
    this.expense.receiptFile = undefined;
    this.expense.receiptFileName = undefined;
    this.expense.receiptUrl = undefined;
    this.imagePreviewUrl = null;
    this.isImage = false;
    this.attachmentName = '';
    this.attachmentSize = 0;
    this.capturedImageUrl = null;
    this.stopCamera();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  downloadFile(): void {
    if (this.capturedImageUrl && this.isImage) {
      const a = document.createElement('a');
      a.href = this.capturedImageUrl;
      a.download = this.attachmentName || `receipt_${Date.now()}.jpg`;
      a.click();
    } else if (this.expense.receiptFile) {
      const url = window.URL.createObjectURL(this.expense.receiptFile);
      this.triggerDownload(url, this.expense.receiptFileName!);
    } else if (this.expense.receiptUrl) {
      this.triggerDownload(this.expense.receiptUrl, this.expense.receiptFileName || 'receipt');
    }
  }

  private triggerDownload(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (this.expense.receiptFile) {
      window.URL.revokeObjectURL(url);
    }
  }

  formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 Bytes';
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
    const canvas = document.createElement('canvas');

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `receipt_capture_${Date.now()}.jpg`;
            this.expense.receiptFile = new File([blob], fileName, { type: 'image/jpeg' });
            this.expense.receiptFileName = fileName;
            this.attachmentName = fileName;
            this.attachmentSize = blob.size;
            this.isImage = true;
            this.capturedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
            this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(this.capturedImageUrl);
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
    setTimeout(() => this.openCamera(), 300);
  }

  onNativeCameraCapture(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        this.expense.receiptFile = file;
        this.expense.receiptFileName = file.name;
        this.attachmentName = file.name;
        this.attachmentSize = file.size;
        this.isImage = file.type.startsWith('image/');
        this.updatePreview(file);
      } else {
        alert('File size must be under 10MB');
      }
    }
    event.target.value = '';
  }

  get isCameraAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  get hasFile(): boolean {
    return !!(this.expense.receiptFile || this.expense.receiptUrl || this.capturedImageUrl);
  }

  onCancel(): void {
    this.stopCamera();
    this.dialogRef.close();
  }

  onSave(): void {
    this.stopCamera();
    const payload = { ...this.expense };
    this.dialogRef.close(payload);
  }
}