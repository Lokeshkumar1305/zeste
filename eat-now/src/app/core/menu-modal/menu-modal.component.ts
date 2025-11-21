import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const VEG = 'VEG';
const NON_VEG = 'NON_VEG';
const EGG = 'EGG';

interface MenuItem {
  itemName: string;
  description: string;
  mealType: string;
  itemTypes: string[];        // e.g. ["Spicy", "Jain"]
  itemType: typeof VEG | typeof NON_VEG | typeof EGG;  // <-- changed to single value
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

  // Constants exposed to template
  VEG = VEG;
  NON_VEG = NON_VEG;
  EGG = EGG;

  newMealType: string = '';

  menu: MenuItem = {
    itemName: '',
    description: '',
    mealType: '',
    itemTypes: [],
    itemType: VEG,           // default value
    isAvailable: true
  };

  imagePreviewUrl: SafeUrl | null = null;

  // Meal Type Configuration (unchanged)
  allMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  enabledMealTypes: { [key: string]: boolean } = {
    Breakfast: true,
    Lunch: true,
    Dinner: true
  };
  availableMealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner'];
  showMealConfig = false;

  constructor(
    public dialogRef: MatDialogRef<MenuModalComponent>,
    private sanitizer: DomSanitizer
  ) {
    this.updateAvailableMealTypes();
  }

 openMealTypeConfig() {
    this.showMealConfig = true;
  }

 
  updateAvailableMealTypes() {
    this.availableMealTypes = this.allMealTypes.filter(type => this.enabledMealTypes[type]);
    if (this.menu.mealType && !this.availableMealTypes.includes(this.menu.mealType)) {
      this.menu.mealType = '';
    }
  }

  toggleItemType(type: string) {
    const idx = this.menu.itemTypes.indexOf(type);
    if (idx > -1) {
      this.menu.itemTypes.splice(idx, 1);
    } else {
      this.menu.itemTypes.push(type);
    }
  }

  // ... other methods (image, meal config, save, cancel) unchanged ...

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      this.menu.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image under 2MB');
    }
  }

  addMealType() {
    const trimmed = this.newMealType.trim();
    if (trimmed && !this.availableMealTypes.includes(trimmed)) {
      this.availableMealTypes.push(trimmed);
      this.newMealType = '';
    }
  }

  removeMealType(type: string) {
    if (this.availableMealTypes.length === 1) return;

    this.availableMealTypes = this.availableMealTypes.filter(t => t !== type);

    // If deleted type was selected, clear selection
    if (this.menu.mealType === type) {
      this.menu.mealType = '';
    }
  }

  removeImage() {
    this.menu.imageFile = undefined;
    this.imagePreviewUrl = null;
    if (this.itemImageInput) {
      this.itemImageInput.nativeElement.value = '';
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  closeConfig() {
    this.showMealConfig = false;
  }

  onSave() {
    const payload = {
      ...this.menu,
      enabledMealTypes: this.enabledMealTypes
    };
    this.dialogRef.close(payload);
  }


}