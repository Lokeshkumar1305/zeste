// tenant-complaints.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

interface Complaint {
  id?: string;
  tenantName: string;
  roomNumber: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  imageFile?: File;
  imagePreview?: string;
  imageName?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  submittedDate?: Date;
  resolvedDate?: Date;
  adminResponse?: string;
}

@Component({
  selector: 'app-tenant-complaints',
  templateUrl: './tenant-complaints.component.html',
  styleUrls: ['./tenant-complaints.component.scss']
})
export class TenantComplaintsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('cameraPreview') cameraPreview!: ElementRef;

  private destroy$ = new Subject<void>();

  activeView: 'list' | 'create' = 'list';

  myComplaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  selectedComplaint: Complaint | null = null;

  newComplaint: Complaint = this.getEmptyComplaint();

  statusFilter: string = 'all';
  searchTerm: string = '';

  categories = [
    'Electrical',
    'Plumbing',
    'Furniture',
    'Appliances',
    'Cleaning',
    'Maintenance',
    'Security',
    'Others'
  ];

  priorities = ['Low', 'Medium', 'High', 'Urgent'];

  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  };

  showCameraPreview = false;
  isCameraAvailable = false;
  currentStream: MediaStream | null = null;
  facingMode: 'user' | 'environment' = 'environment';
  isMobileOrTablet = false;

  isLoading = false;
  isSubmitting = false;

  defaultImage = 'assets/images/default-damage.jpg';

  ngOnInit(): void {
    this.checkDeviceType();
    this.checkCameraAvailability();
    this.loadMyComplaints();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMyComplaints(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.myComplaints = this.getMockComplaints();
      this.applyFilters();
      this.calculateStats();
      this.isLoading = false;
    }, 800);
  }

  getMockComplaints(): Complaint[] {
    return [
      {
        id: '1',
        tenantName: 'John Doe',
        roomNumber: '101',
        category: 'Electrical',
        priority: 'High',
        title: 'AC Not Working',
        description: 'The air conditioner in my room has stopped working. It\'s not cooling at all.',
        status: 'IN_PROGRESS',
        submittedDate: new Date('2024-01-10'),
        imageName: 'ac-damage.jpg',
        adminResponse: 'Our technician will visit your room tomorrow between 2-4 PM.'
      },
      {
        id: '2',
        tenantName: 'John Doe',
        roomNumber: '101',
        category: 'Plumbing',
        priority: 'Urgent',
        title: 'Water Leakage in Bathroom',
        description: 'There is continuous water leakage from the bathroom ceiling.',
        status: 'PENDING',
        submittedDate: new Date('2024-01-12'),
        imageName: 'leak.jpg'
      },
      {
        id: '3',
        tenantName: 'John Doe',
        roomNumber: '101',
        category: 'Furniture',
        priority: 'Low',
        title: 'Broken Chair',
        description: 'Study table chair is broken and needs replacement.',
        status: 'RESOLVED',
        submittedDate: new Date('2024-01-05'),
        resolvedDate: new Date('2024-01-08'),
        imageName: 'chair.jpg',
        adminResponse: 'Chair has been replaced. Please check and confirm.'
      },
      {
        id: '4',
        tenantName: 'John Doe',
        roomNumber: '101',
        category: 'Cleaning',
        priority: 'Medium',
        title: 'Room Needs Deep Cleaning',
        description: 'The room hasn\'t been cleaned properly for a week.',
        status: 'REJECTED',
        submittedDate: new Date('2024-01-08'),
        resolvedDate: new Date('2024-01-09'),
        adminResponse: 'Regular cleaning is tenant\'s responsibility as per hostel rules.'
      }
    ];
  }

  calculateStats(): void {
    this.stats.total = this.myComplaints.length;
    this.stats.pending = this.myComplaints.filter(c => c.status === 'PENDING').length;
    this.stats.inProgress = this.myComplaints.filter(c => c.status === 'IN_PROGRESS').length;
    this.stats.resolved = this.myComplaints.filter(c => c.status === 'RESOLVED').length;
  }

  applyFilters(): void {
    let filtered = [...this.myComplaints];

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === this.statusFilter);
    }

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.category.toLowerCase().includes(search)
      );
    }

    this.filteredComplaints = filtered;
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  showCreateForm(): void {
    this.activeView = 'create';
    this.newComplaint = this.getEmptyComplaint();
  }

  showComplaintsList(): void {
    this.activeView = 'list';
    this.newComplaint = this.getEmptyComplaint();
    this.stopCamera();
  }

  viewComplaintDetail(complaint: Complaint): void {
    this.selectedComplaint = complaint;
  }

  closeComplaintDetail(): void {
    this.selectedComplaint = null;
  }

  getEmptyComplaint(): Complaint {
    return {
      tenantName: 'John Doe',
      roomNumber: '101',
      category: '',
      priority: '',
      title: '',
      description: ''
    };
  }

  onSubmitComplaint(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const newComplaint: Complaint = {
        ...this.newComplaint,
        id: Date.now().toString(),
        status: 'PENDING',
        submittedDate: new Date()
      };

      this.myComplaints.unshift(newComplaint);
      this.applyFilters();
      this.calculateStats();

      this.isSubmitting = false;
      this.showComplaintsList();

      alert('Complaint submitted successfully!');
    }, 1500);
  }

  isFormValid(): boolean {
    return !!(
      this.newComplaint.tenantName &&
      this.newComplaint.roomNumber &&
      this.newComplaint.category &&
      this.newComplaint.priority &&
      this.newComplaint.title &&
      this.newComplaint.description &&
      this.newComplaint.imageFile
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (file.size > 10 * 1024 * 1024) {
        alert('File size should not exceed 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      this.newComplaint.imageFile = file;
      this.newComplaint.imageName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newComplaint.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.newComplaint.imageFile = undefined;
    this.newComplaint.imagePreview = undefined;
    this.newComplaint.imageName = undefined;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  downloadImage(): void {
    if (this.newComplaint.imagePreview) {
      const link = document.createElement('a');
      link.href = this.newComplaint.imagePreview;
      link.download = this.newComplaint.imageName || 'damage-image.jpg';
      link.click();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  checkDeviceType(): void {
    this.isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  async checkCameraAvailability(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.isCameraAvailable = devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error checking camera availability:', error);
      this.isCameraAvailable = false;
    }
  }

  async openCamera(): Promise<void> {
    try {
      const constraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.showCameraPreview = true;

      setTimeout(() => {
        const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
        if (videoElement && this.currentStream) {
          videoElement.srcObject = this.currentStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }

  stopCamera(): void {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
    this.showCameraPreview = false;
  }

  async switchCamera(): Promise<void> {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopCamera();
    await this.openCamera();
  }

  captureImage(): void {
    const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
    if (!videoElement) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoElement, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          this.newComplaint.imageFile = file;
          this.newComplaint.imageName = file.name;
          this.newComplaint.imagePreview = canvas.toDataURL('image/jpeg');

          this.stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  }

  onNativeCameraCapture(event: Event): void {
    this.onFileSelected(event);
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-progress',
      'RESOLVED': 'status-resolved',
      'REJECTED': 'status-rejected'
    };
    return classes[status] || 'status-pending';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'PENDING': 'bi-clock-history',
      'IN_PROGRESS': 'bi-arrow-repeat',
      'RESOLVED': 'bi-check-circle',
      'REJECTED': 'bi-x-circle'
    };
    return icons[status] || 'bi-circle';
  }

  getPriorityClass(priority: string): string {
    const classes: any = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
      'Urgent': 'priority-urgent'
    };
    return classes[priority] || 'priority-low';
  }

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Electrical': 'bi-lightning-charge',
      'Plumbing': 'bi-droplet',
      'Furniture': 'bi-house-door',
      'Appliances': 'bi-tv',
      'Cleaning': 'bi-stars',
      'Maintenance': 'bi-tools',
      'Security': 'bi-shield-check',
      'Others': 'bi-three-dots'
    };
    return icons[category] || 'bi-circle';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysSince(date: Date | undefined): number {
    if (!date) return 0;
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  refreshComplaints(): void {
    this.loadMyComplaints();
  }

  trackById(index: number, item: Complaint): string {
    return item.id || index.toString();
  }

  get hasImage(): boolean {
    return !!(this.newComplaint.imageFile || this.newComplaint.imagePreview);
  }
}