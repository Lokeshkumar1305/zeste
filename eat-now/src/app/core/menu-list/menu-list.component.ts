import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MenuItem } from '../menu/menu.component';

export type MenuRecurrence = 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type MenuStatus = 'AVAILABLE' | 'COMPLETED';

export interface MenuItemInMenu {
  itemId: string;
  status: MenuStatus;
}

export interface HostelMenuPayload {
  startDate: Date;
  endDate?: Date | null;
  mealType: string;
  recurrence: MenuRecurrence;
  serveFrom?: string | null;
  serveTo?: string | null;
  items: MenuItemInMenu[];
}

export interface PublishedMenu extends HostelMenuPayload {
  id: number;
  status: MenuStatus;          // overall meal status
}

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent implements OnInit {

  menuForm!: FormGroup;

  // Mock data – hook this to your Menu Config API
  allMenuItems: MenuItem[] = [
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
      isAvailable: true,
      imageUrl: 'assets/images/menu/egg-bhurji.jpg'
    }
  ];

  availableMealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'];

  filteredItems: MenuItem[] = [];
  searchText = '';
  selectedItemIds = new Set<string>();

  recurrenceOptions = [
    { value: 'ONE_TIME' as MenuRecurrence, label: 'Only this day' },
    { value: 'DAILY' as MenuRecurrence, label: 'Repeat daily' },
    { value: 'WEEKLY' as MenuRecurrence, label: 'Repeat weekly' },
    { value: 'MONTHLY' as MenuRecurrence, label: 'Repeat monthly' }
  ];

  defaultImage = 'assets/images/menu/placeholder-food.jpg';

  // Right panel data (cached for UI – avoids heavy recomputation)
  publishedMenus: PublishedMenu[] = [];
  menusForSelectedDate: PublishedMenu[] = [];
  menuItemsCache: Record<number, { menuItem: MenuItem; status: MenuStatus }[]> = {};

  private nextMenuId = 1;
  editingMenuId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      date: [new Date(), Validators.required],
      mealType: ['Breakfast', Validators.required],
      recurrence: ['ONE_TIME' as MenuRecurrence, Validators.required],
      validTill: [null],
      serveFrom: ['08:00'],
      serveTo: ['09:30']
    });

    // Refresh filters whenever meal type changes
    this.menuForm.get('mealType')!.valueChanges.subscribe(() => {
      this.selectedItemIds.clear();
      this.applyFilters();
    });

    // Refresh right‑panel list whenever date changes
    this.menuForm.get('date')!.valueChanges.subscribe(() => {
      this.refreshMenusForSelectedDate();
    });

    this.applyFilters();
    this.refreshMenusForSelectedDate();
  }

  // ---------- LEFT PANEL: filtering & card selection ----------

  applyFilters(): void {
    const mealType = this.menuForm.get('mealType')!.value;
    const text = this.searchText.trim().toLowerCase();

    this.filteredItems = this.allMenuItems
      .filter(i => i.isAvailable)
      .filter(i => !mealType || i.mealType === mealType)
      .filter(i => {
        if (!text) return true;
        return (
          i.itemName.toLowerCase().includes(text) ||
          (i.description ?? '').toLowerCase().includes(text)
        );
      });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.applyFilters();
  }

  isSelected(item: MenuItem): boolean {
    return this.selectedItemIds.has(item.id);
  }

  toggleSelection(item: MenuItem, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedItemIds.add(item.id);
    } else {
      this.selectedItemIds.delete(item.id);
    }
  }

  selectAllVisible(): void {
    this.filteredItems.forEach(item => this.selectedItemIds.add(item.id));
  }

  clearSelection(): void {
    this.selectedItemIds.clear();
  }

  clearAll(): void {
    const today = new Date();
    this.editingMenuId = null;
    this.menuForm.reset({
      date: today,
      mealType: 'Breakfast',
      recurrence: 'ONE_TIME',
      validTill: null,
      serveFrom: '08:00',
      serveTo: '09:30'
    });
    this.searchText = '';
    this.selectedItemIds.clear();
    this.applyFilters();
    this.refreshMenusForSelectedDate();
  }

  // ---------- SAVE / UPDATE MENU (left → right) ----------

  onSaveMenu(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const formValue = this.menuForm.value as {
      date: Date;
      mealType: string;
      recurrence: MenuRecurrence;
      validTill: Date | null;
      serveFrom: string | null;
      serveTo: string | null;
    };

    if (formValue.recurrence !== 'ONE_TIME' && !formValue.validTill) {
      this.menuForm.get('validTill')?.setErrors({ required: true });
      this.menuForm.get('validTill')?.markAsTouched();
      return;
    }

    if (!this.selectedItemIds.size) {
      alert('Please select at least one item for this menu.');
      return;
    }

    const items: MenuItemInMenu[] = Array.from(this.selectedItemIds).map(id => ({
      itemId: id,
      status: 'AVAILABLE' as MenuStatus
    }));

    const payload: HostelMenuPayload = {
      startDate: formValue.date,
      endDate: formValue.recurrence === 'ONE_TIME' ? null : formValue.validTill,
      mealType: formValue.mealType,
      recurrence: formValue.recurrence,
      serveFrom: formValue.serveFrom,
      serveTo: formValue.serveTo,
      items
    };

    if (this.editingMenuId != null) {
      const idx = this.publishedMenus.findIndex(m => m.id === this.editingMenuId);
      if (idx > -1) {
        const currentStatus = this.publishedMenus[idx].status;
        this.publishedMenus[idx] = { ...payload, id: this.editingMenuId, status: currentStatus };
      }
    } else {
      const newMenu: PublishedMenu = {
        id: this.nextMenuId++,
        status: 'AVAILABLE',
        ...payload
      };
      this.publishedMenus.push(newMenu);
    }

    // TODO: call backend API here

    this.editingMenuId = null;
    this.clearSelection();
    this.searchText = '';
    this.applyFilters();
    this.refreshMenusForSelectedDate();
  }

  // ---------- RIGHT PANEL: cached menus for selected date ----------

  private refreshMenusForSelectedDate(): void {
    const selectedDate: Date | null = this.menuForm.get('date')!.value;
    if (!selectedDate) {
      this.menusForSelectedDate = [];
      this.menuItemsCache = {};
      return;
    }

    const list = this.publishedMenus
      .filter(m => this.isMenuEffectiveOnDate(m, selectedDate))
      .sort((a, b) => this.mealOrder(a.mealType) - this.mealOrder(b.mealType));

    this.menusForSelectedDate = list;

    const cache: Record<number, { menuItem: MenuItem; status: MenuStatus }[]> = {};
    for (const m of list) {
      const arr: { menuItem: MenuItem; status: MenuStatus }[] = [];
      for (const mi of m.items) {
        const item = this.allMenuItems.find(i => i.id === mi.itemId);
        if (item) {
          arr.push({ menuItem: item, status: mi.status });
        }
      }
      cache[m.id] = arr;
    }
    this.menuItemsCache = cache;
  }

  onStatusChange(menu: PublishedMenu, status: MenuStatus): void {
    menu.status = status;
    // TODO: update in backend
  }

  onItemStatusChange(menu: PublishedMenu, itemId: string, status: MenuStatus): void {
    const item = menu.items.find(i => i.itemId === itemId);
    if (item) {
      item.status = status;
    }
    const cachedArr = this.menuItemsCache[menu.id];
    if (cachedArr) {
      const found = cachedArr.find(x => x.menuItem.id === itemId);
      if (found) {
        found.status = status;
      }
    }
    // TODO: update in backend
  }

  onEditPublished(menu: PublishedMenu): void {
    this.editingMenuId = menu.id;

    this.menuForm.patchValue(
      {
        date: new Date(menu.startDate),
        mealType: menu.mealType,
        recurrence: menu.recurrence,
        validTill: menu.endDate ? new Date(menu.endDate) : null,
        serveFrom: menu.serveFrom || '',
        serveTo: menu.serveTo || ''
      },
      { emitEvent: false } // avoid duplicate refresh
    );

    this.applyFilters();
    this.selectedItemIds = new Set(menu.items.map(i => i.itemId));
    this.refreshMenusForSelectedDate();
  }

  onDeletePublished(id: number): void {
    if (!confirm('Remove this menu from the schedule?')) return;
    this.publishedMenus = this.publishedMenus.filter(m => m.id !== id);
    if (this.editingMenuId === id) {
      this.editingMenuId = null;
      this.clearSelection();
    }
    this.refreshMenusForSelectedDate();
    // TODO: delete from backend
  }

  getRecurrenceLabel(rec: MenuRecurrence): string {
    switch (rec) {
      case 'ONE_TIME': return 'Only this day';
      case 'DAILY': return 'Daily';
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
    }
  }

  // ---------- Helpers ----------

  private normalizeDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private isMenuEffectiveOnDate(menu: PublishedMenu, day: Date): boolean {
    const target = this.normalizeDate(day);
    const start = this.normalizeDate(new Date(menu.startDate));
    const end = menu.endDate ? this.normalizeDate(new Date(menu.endDate)) : null;

    if (target < start) return false;
    if (end && target > end) return false;

    switch (menu.recurrence) {
      case 'ONE_TIME': return target.getTime() === start.getTime();
      case 'DAILY': return true;
      case 'WEEKLY': return target.getDay() === start.getDay();
      case 'MONTHLY': return target.getDate() === start.getDate();
      default: return false;
    }
  }

  private mealOrder(meal: string): number {
    const order: Record<string, number> = {
      Breakfast: 1,
      Lunch: 2,
      Snacks: 3,
      Dinner: 4,
      Beverages: 5
    };
    return order[meal] ?? 999;
  }

  trackById(_: number, item: MenuItem): string {
    return item.id;
  }

  trackByPublishedId(_: number, m: PublishedMenu): number {
    return m.id;
  }
}