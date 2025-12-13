import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaintenanceService } from '../../shared/services/maintenance.service';


interface CategorySet {
  name: string;
  description: string;
}

@Component({
  selector: 'app-expenses-category-modal',
  templateUrl: './expenses-category-modal.component.html',
  styleUrl: './expenses-category-modal.component.scss'
})
export class ExpensesCategoryModalComponent implements OnInit {

 tempCategorySets: CategorySet[] = [{ name: '', description: '' }]; // Start with one empty set

  constructor(
    public dialogRef: MatDialogRef<ExpensesCategoryModalComponent>,
    private cfg: MaintenanceService
  ) {}

  ngOnInit(): void {
    // this.cfg.config$.subscribe(config => {
    //   if (config.categories && config.categories.length > 0) {
    //     // Map existing categories to sets (description not stored yet, so empty)
    //     this.tempCategorySets = config.categories.map(name => ({
    //       name,
    //       description: ''
    //     }));
    //   } else {
    //     this.tempCategorySets = [{ name: '', description: '' }];
    //   }
    // });
  }

  addCategorySet(): void {
    this.tempCategorySets.push({ name: '', description: '' });
  }

  removeCategorySet(index: number): void {
    if (this.tempCategorySets.length > 1) {
      this.tempCategorySets.splice(index, 1);
    }
  }

  hasValidCategories(): boolean {
    return this.tempCategorySets.some(set => set.name.trim() !== '');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const validCategories = this.tempCategorySets
      .map(set => set.name.trim())
      .filter(name => name !== '');

    if (validCategories.length === 0) return;

    this.cfg.updateCategories(validCategories);
    // Optionally save descriptions in future: this.cfg.updateCategoryDescriptions(...)
    this.dialogRef.close();
  }
}
