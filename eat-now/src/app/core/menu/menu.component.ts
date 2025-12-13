import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';

export interface MenuItem {
  id: string;
  itemName: string;
  description?: string;
  mealType: string;        // e.g., Breakfast, Lunch, Snacks
  itemType: 'VEG' | 'NON_VEG' | 'EGG';
  isAvailable: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  // Real menu data – in real app this will come from API.
  public allMenuItems: MenuItem[] = [
    {
      id: 'M001',
      itemName: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella and basil',
      mealType: 'Lunch',
      itemType: 'VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/margherita.jpg'
    },
    {
      id: 'M002',
      itemName: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      mealType: 'Dinner',
      itemType: 'NON_VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/butter-chicken.jpg'
    },
    {
      id: 'M003',
      itemName: 'Masala Dosa',
      description: 'Crispy crepe with spicy potato filling',
      mealType: 'Breakfast',
      itemType: 'VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/masala-dosa.jpg'
    },
    {
      id: 'M004',
      itemName: 'Egg Bhurji',
      description: 'Spicy scrambled eggs with onions and spices',
      mealType: 'Breakfast',
      itemType: 'EGG',
      isAvailable: false,
      imageUrl: 'assets/images/menu/egg-bhurji.jpg'
    }
  ];

  public selectedMealTypeFilter: string = 'All';
  public availableMealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'];

  public pageSizeOptions = [5, 10, 25];
  public pageSize = 5;
  public currentPage = 1;

  public filteredMenuItems: MenuItem[] = [];
  public pagedMenuItems: MenuItem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  // --- Pagination Getters ---
  get totalItems() { return this.filteredMenuItems.length; }
  get totalPages() { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get showingFrom() { return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get showingTo() { return Math.min(this.currentPage * this.pageSize, this.totalItems); }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  // --- Filter & Pagination
  applyFilters() {
    let filtered = this.allMenuItems;

    if (this.selectedMealTypeFilter !== 'All') {
      filtered = filtered.filter(item => item.mealType === this.selectedMealTypeFilter);
    }

    this.filteredMenuItems = filtered;
    this.currentPage = 1;
    this.updatePagedItems();
  }

  updatePagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedMenuItems = this.filteredMenuItems.slice(start, end);
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagedItems();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedItems();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedItems();
    }
  }

  // --- CRUD ---
  onAddNewMenu() {
    const dialogRef = this.dialog.open(MenuModalComponent, {
      width: '560px',
      maxWidth: '90vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      data: {
        menu: null,
        availableMealTypes: this.availableMealTypes
      },
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: MenuItem) => {
      if (result) {
        result.id = 'M' + String(this.allMenuItems.length + 1).padStart(3, '0');
        this.allMenuItems.push(result);

        if (!this.availableMealTypes.includes(result.mealType)) {
          this.availableMealTypes.push(result.mealType);
          this.availableMealTypes.sort();
        }

        this.applyFilters();
      }
    });
  }

  onEditMenu(item: MenuItem) {
    const dialogRef = this.dialog.open(MenuModalComponent, {
      width: '560px',
      maxWidth: '90vw',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'custom-dialog-container',
      data: {
        menu: { ...item },
        availableMealTypes: this.availableMealTypes
      },
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: MenuItem) => {
      if (result) {
        const index = this.allMenuItems.findIndex(m => m.id === item.id);
        if (index > -1) {
          this.allMenuItems[index] = result;
          this.applyFilters();
        }
      }
    });
  }

  onDeleteMenu(id: string) {
    if (confirm('Delete this menu item permanently?')) {
      this.allMenuItems = this.allMenuItems.filter(m => m.id !== id);
      this.applyFilters();
    }
  }

  onFilter() {
    const order = ['All', ...this.availableMealTypes];
    const idx = order.indexOf(this.selectedMealTypeFilter);
    this.selectedMealTypeFilter = order[(idx + 1) % order.length];
    this.applyFilters();
  }

  onReset() {
    this.selectedMealTypeFilter = 'All';
    this.pageSize = this.pageSizeOptions[0];
    this.currentPage = 1;
    this.applyFilters();
  }

  trackById(_: number, item: MenuItem) {
    return item.id;
  }
}