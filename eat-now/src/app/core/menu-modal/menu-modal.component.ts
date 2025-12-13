import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export type ItemType = 'VEG' | 'NON_VEG' | 'EGG';

export interface MenuItem {
  itemName: string;
  description: string;
  mealType: string;
  itemType: ItemType;
  isAvailable: boolean;
  imageFile?: File;
  imageUrl?: string;
}

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss']
})
export class MenuModalComponent {
  @ViewChild('itemImageInput') itemImageInput!: ElementRef<HTMLInputElement>;

  // Item type options for template
  readonly itemTypeOptions: { value: ItemType; label: string; icon: string; colorClass: string }[] = [
    { value: 'VEG', label: 'Veg', icon: 'bi-circle-fill', colorClass: 'text-success' },
    { value: 'NON_VEG', label: 'Non-Veg', icon: 'bi-circle-fill', colorClass: 'text-danger' },
    { value: 'EGG', label: 'Egg', icon: 'bi-egg-fill', colorClass: 'text-warning' }
  ];

  newMealType = '';

  menu: MenuItem = {
    itemName: '',
    description: '',
    mealType: '',
    itemType: 'VEG',
    isAvailable: true
  };

  imagePreviewUrl: SafeUrl | null = null;

  // Meal Type Configuration
  availableMealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner'];
  showMealConfig = false;

  constructor(
    public dialogRef: MatDialogRef<MenuModalComponent>,
    private sanitizer: DomSanitizer
  ) {}

  // ✅ ADD THIS METHOD
  trackByMealType(index: number, type: string): string {
    return type;
  }

  openMealTypeConfig(): void {
    this.showMealConfig = true;
  }

  closeConfig(): void {
    this.showMealConfig = false;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      this.menu.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image under 2MB');
    }
  }

  addMealType(): void {
    const trimmed = this.newMealType.trim();
    if (trimmed && !this.availableMealTypes.includes(trimmed)) {
      this.availableMealTypes.push(trimmed);
      this.newMealType = '';
    }
  }

  removeMealType(type: string): void {
    if (this.availableMealTypes.length === 1) return;

    this.availableMealTypes = this.availableMealTypes.filter(t => t !== type);

    // If deleted type was selected, clear selection
    if (this.menu.mealType === type) {
      this.menu.mealType = '';
    }
  }

  removeImage(): void {
    this.menu.imageFile = undefined;
    this.imagePreviewUrl = null;
    if (this.itemImageInput) {
      this.itemImageInput.nativeElement.value = '';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const payload = {
      ...this.menu,
      availableMealTypes: this.availableMealTypes
    };
    this.dialogRef.close(payload);
  }

  /** Check if form is valid */
  get isFormValid(): boolean {
    return !!(this.menu.itemName?.trim() && this.menu.mealType);
  }
}