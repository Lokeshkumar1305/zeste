import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BedsService } from '../../shared/services/beds.service';
import { RoomConfigService } from '../../shared/services/room-config.service';
import { AmenitiesManagementModalComponent } from '../amenities-management-modal/amenities-management-modal.component';
import { RoomManagementModalComponent } from '../room-management-modal/room-management-modal.component';
import { RoomType } from '../room-type-management/room-type-management.component';
import { InventoryService } from '../../shared/services/inventory.service';
import { Category } from '../../shared/services/inventory.service';



export interface RoomDetails {
  roomNumber: string;
  type: string;
  monthlyRent: number | null;
  securityDeposit: number | null;
  floor: string | null;
  beds: number | null;
  status: string;
  description: string;
  amenities: string[];
}

@Component({
  selector: 'app-inventory-items-categories-modal',
  templateUrl: './inventory-items-categories-modal.component.html',
  styleUrl: './inventory-items-categories-modal.component.scss'
})
export class InventoryItemsCategoriesModalComponent implements OnInit {
  
  category: Partial<Category> = {
    name: '',
    description: '',
    parentId: null,
    isActive: true
  };

  existingCategories: Category[] = [];
  isEditMode = false;

  // Suggested categories for hostels
  suggestedCategories = [
    { name: 'Food & Groceries', desc: 'Rice, dal, vegetables, spices, cooking oil', icon: 'bi-basket' },
    { name: 'Cleaning Supplies', desc: 'Brooms, mops, detergents, disinfectants', icon: 'bi-droplet' },
    { name: 'Toiletries', desc: 'Soap, toilet paper, hand wash, air freshener', icon: 'bi-flower1' },
    { name: 'Bedding & Linens', desc: 'Bed sheets, pillows, blankets, towels', icon: 'bi-house' },
    { name: 'Kitchen Items', desc: 'Utensils, plates, glasses, containers', icon: 'bi-cup-hot' },
    { name: 'Maintenance', desc: 'Light bulbs, tools, paint, repair items', icon: 'bi-tools' },
    { name: 'Stationery', desc: 'Registers, pens, files, paper', icon: 'bi-pencil' },
    { name: 'Medical Supplies', desc: 'First aid, medicines, sanitizers', icon: 'bi-plus-circle' }
  ];

  constructor(
    public dialogRef: MatDialogRef<InventoryItemsCategoriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: Category },
    private inventoryService: InventoryService
  ) {
    if (data?.category) {
      this.category = { ...data.category };
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.inventoryService.categories$.subscribe(cats => {
      this.existingCategories = cats.filter(c => 
        !this.data?.category || c.id !== this.data.category.id
      );
    });
  }

  selectSuggested(suggested: any): void {
    this.category.name = suggested.name;
    this.category.description = suggested.desc;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.category.name) {
      alert('Please enter a category name');
      return;
    }

    if (this.isEditMode && this.data.category?.id) {
      this.inventoryService.updateCategory(this.data.category.id, this.category);
    } else {
      this.inventoryService.addCategory(this.category as Omit<Category, 'id' | 'createdAt'>);
    }

    this.dialogRef.close(this.category);
  }
}