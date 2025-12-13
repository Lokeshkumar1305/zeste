import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

export type MenuRecurrence = 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type MenuStatus = 'AVAILABLE' | 'COMPLETED';
export type MenuMode = 'DATE' | 'DAY_OF_WEEK';
export type ItemType = 'VEG' | 'NON_VEG' | 'EGG';

export interface MenuItem {
  id: string;
  itemName: string;
  description?: string;
  mealType: string;
  itemType: ItemType;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface MenuItemInMenu {
  itemId: string;
  status: MenuStatus;
}

export interface HostelMenuPayload {
  mode: MenuMode;
  startDate?: Date | null;
  dayOfWeek?: number | null;
  endDate?: Date | null;
  mealType: string;
  recurrence: MenuRecurrence;
  serveFrom?: string | null;
  serveTo?: string | null;
  items: MenuItemInMenu[];
}

export interface PublishedMenu extends HostelMenuPayload {
  id: number;
  status: MenuStatus;
}

export interface DayOfWeekOption {
  value: number;
  label: string;
  short: string;
}

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {

  menuForm!: FormGroup;

  // Mode toggle
  menuMode: MenuMode = 'DATE';

  // Days of week options
  daysOfWeek: DayOfWeekOption[] = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' }
  ];

  // Mock data
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
    },
    {
      id: 'M005',
      itemName: 'Paneer Tikka',
      description: 'Grilled cottage cheese with spices',
      mealType: 'Dinner',
      itemType: 'VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/paneer-tikka.jpg'
    },
    {
      id: 'M006',
      itemName: 'Idli Sambar',
      description: 'Steamed rice cakes with lentil soup',
      mealType: 'Breakfast',
      itemType: 'VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/idli.jpg'
    },
    {
      id: 'M007',
      itemName: 'Chicken Biryani',
      description: 'Fragrant basmati rice with spiced chicken',
      mealType: 'Lunch',
      itemType: 'NON_VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/biryani.jpg'
    },
    {
      id: 'M008',
      itemName: 'Samosa',
      description: 'Crispy pastry with spiced potato filling',
      mealType: 'Snacks',
      itemType: 'VEG',
      isAvailable: true,
      imageUrl: 'assets/images/menu/samosa.jpg'
    }
  ];

  availableMealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'];

  filteredItems: MenuItem[] = [];
  searchText = '';
  selectedItemIds = new Set<string>();

  recurrenceOptions: { value: MenuRecurrence; label: string }[] = [
    { value: 'ONE_TIME', label: 'Only this day' },
    { value: 'DAILY', label: 'Repeat daily' },
    { value: 'WEEKLY', label: 'Repeat weekly' },
    { value: 'MONTHLY', label: 'Repeat monthly' }
  ];

  defaultImage = 'assets/images/menu/placeholder-food.jpg';

  // Right panel data
  publishedMenus: PublishedMenu[] = [];
  menusForSelectedDate: PublishedMenu[] = [];
  menusForSelectedDay: PublishedMenu[] = [];
  menuItemsCache: Record<number, { menuItem: MenuItem; status: MenuStatus }[]> = {};

  // For day view - selected day in right panel
  selectedViewDay = 1;

  private nextMenuId = 1;
  editingMenuId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      date: [new Date(), Validators.required],
      dayOfWeek: [1],
      mealType: ['Breakfast', Validators.required],
      recurrence: ['ONE_TIME' as MenuRecurrence, Validators.required],
      validTill: [null],
      serveFrom: ['08:00'],
      serveTo: ['09:30']
    });

    this.menuForm.get('mealType')!.valueChanges.subscribe(() => {
      this.selectedItemIds.clear();
      this.applyFilters();
    });

    this.menuForm.get('date')!.valueChanges.subscribe(() => {
      if (this.menuMode === 'DATE') {
        this.refreshMenusForSelectedDate();
      }
    });

    this.menuForm.get('dayOfWeek')!.valueChanges.subscribe((day: number) => {
      if (this.menuMode === 'DAY_OF_WEEK') {
        this.selectedViewDay = day;
        this.refreshMenusForSelectedDay();
      }
    });

    this.applyFilters();
    this.refreshMenusForSelectedDate();
    this.refreshMenusForSelectedDay();
  }

  // ---------- MODE SWITCHING ----------

  onModeChange(mode: MenuMode): void {
    this.menuMode = mode;
    this.editingMenuId = null;
    this.selectedItemIds.clear();
    
    if (mode === 'DAY_OF_WEEK') {
      this.menuForm.patchValue({ recurrence: 'WEEKLY' });
      this.selectedViewDay = this.menuForm.get('dayOfWeek')!.value;
      this.refreshMenusForSelectedDay();
    } else {
      this.menuForm.patchValue({ recurrence: 'ONE_TIME' });
      this.refreshMenusForSelectedDate();
    }
  }

  onViewDayChange(day: number): void {
    this.selectedViewDay = day;
    this.refreshMenusForSelectedDay();
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

  onCardClick(item: MenuItem): void {
    if (this.selectedItemIds.has(item.id)) {
      this.selectedItemIds.delete(item.id);
    } else {
      this.selectedItemIds.add(item.id);
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
    this.menuMode = 'DATE';
    this.menuForm.reset({
      date: today,
      dayOfWeek: 1,
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
    this.refreshMenusForSelectedDay();
  }

  // ---------- SAVE / UPDATE MENU ----------

  onSaveMenu(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const formValue = this.menuForm.value;

    if (this.menuMode === 'DATE' && formValue.recurrence !== 'ONE_TIME' && !formValue.validTill) {
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
      mode: this.menuMode,
      startDate: this.menuMode === 'DATE' ? formValue.date : null,
      dayOfWeek: this.menuMode === 'DAY_OF_WEEK' ? formValue.dayOfWeek : null,
      endDate: this.menuMode === 'DATE' && formValue.recurrence !== 'ONE_TIME' ? formValue.validTill : null,
      mealType: formValue.mealType,
      recurrence: this.menuMode === 'DAY_OF_WEEK' ? 'WEEKLY' : formValue.recurrence,
      serveFrom: formValue.serveFrom,
      serveTo: formValue.serveTo,
      items
    };

    if (this.editingMenuId != null) {
      const idx = this.publishedMenus.findIndex(m => m.id === this.editingMenuId);
      if (idx > -1) {
        const currentStatus = this.publishedMenus[idx].status;
        this.publishedMenus[idx] = { ...payload, id: this.editingMenuId, status: currentStatus };
        // Update cache
        delete this.menuItemsCache[this.editingMenuId];
      }
    } else {
      const newMenu: PublishedMenu = {
        id: this.nextMenuId++,
        status: 'AVAILABLE',
        ...payload
      };
      this.publishedMenus.push(newMenu);
    }

    this.editingMenuId = null;
    this.clearSelection();
    this.searchText = '';
    this.applyFilters();
    this.refreshMenusForSelectedDate();
    this.refreshMenusForSelectedDay();
  }

  // ---------- RIGHT PANEL: DATE MODE ----------

  private refreshMenusForSelectedDate(): void {
    const selectedDate: Date | null = this.menuForm.get('date')!.value;
    if (!selectedDate) {
      this.menusForSelectedDate = [];
      return;
    }

    const list = this.publishedMenus
      .filter(m => m.mode === 'DATE' && this.isMenuEffectiveOnDate(m, selectedDate))
      .sort((a, b) => this.mealOrder(a.mealType) - this.mealOrder(b.mealType));

    this.menusForSelectedDate = list;
    this.buildMenuItemsCache(list);
  }

  // ---------- RIGHT PANEL: DAY OF WEEK MODE ----------

  private refreshMenusForSelectedDay(): void {
    const list = this.publishedMenus
      .filter(m => m.mode === 'DAY_OF_WEEK' && m.dayOfWeek === this.selectedViewDay)
      .sort((a, b) => this.mealOrder(a.mealType) - this.mealOrder(b.mealType));

    this.menusForSelectedDay = list;
    this.buildMenuItemsCache(list);
  }

  private buildMenuItemsCache(menus: PublishedMenu[]): void {
    for (const m of menus) {
      if (!this.menuItemsCache[m.id]) {
        const arr: { menuItem: MenuItem; status: MenuStatus }[] = [];
        for (const mi of m.items) {
          const item = this.allMenuItems.find(i => i.id === mi.itemId);
          if (item) {
            arr.push({ menuItem: item, status: mi.status });
          }
        }
        this.menuItemsCache[m.id] = arr;
      }
    }
  }

  // ---------- STATUS CHANGES ----------

  onStatusChange(menu: PublishedMenu, status: MenuStatus): void {
    menu.status = status;
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
  }

  // ---------- EDIT / DELETE ----------

  onEditPublished(menu: PublishedMenu): void {
    this.editingMenuId = menu.id;
    this.menuMode = menu.mode;

    if (menu.mode === 'DATE') {
      this.menuForm.patchValue(
        {
          date: menu.startDate ? new Date(menu.startDate) : new Date(),
          mealType: menu.mealType,
          recurrence: menu.recurrence,
          validTill: menu.endDate ? new Date(menu.endDate) : null,
          serveFrom: menu.serveFrom || '',
          serveTo: menu.serveTo || ''
        },
        { emitEvent: false }
      );
    } else {
      this.menuForm.patchValue(
        {
          dayOfWeek: menu.dayOfWeek,
          mealType: menu.mealType,
          recurrence: 'WEEKLY',
          serveFrom: menu.serveFrom || '',
          serveTo: menu.serveTo || ''
        },
        { emitEvent: false }
      );
    }

    this.applyFilters();
    this.selectedItemIds = new Set(menu.items.map(i => i.itemId));
  }

  onDeletePublished(id: number): void {
    if (!confirm('Remove this menu from the schedule?')) return;
    this.publishedMenus = this.publishedMenus.filter(m => m.id !== id);
    delete this.menuItemsCache[id];
    if (this.editingMenuId === id) {
      this.editingMenuId = null;
      this.clearSelection();
    }
    this.refreshMenusForSelectedDate();
    this.refreshMenusForSelectedDay();
  }

  // ---------- HELPERS ----------

  getDayLabel(dayValue: number | null | undefined): string {
    if (dayValue == null) return '';
    const day = this.daysOfWeek.find(d => d.value === dayValue);
    return day ? day.label : '';
  }

  getRecurrenceLabel(rec: MenuRecurrence): string {
    const option = this.recurrenceOptions.find(o => o.value === rec);
    return option ? option.label : rec;
  }

  getMenuItemsCount(menuId: number): number {
    const items = this.menuItemsCache[menuId];
    return items ? items.length : 0;
  }

  getMenuItems(menuId: number): { menuItem: MenuItem; status: MenuStatus }[] {
    return this.menuItemsCache[menuId] || [];
  }

  private normalizeDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private isMenuEffectiveOnDate(menu: PublishedMenu, day: Date): boolean {
    if (!menu.startDate) return false;
    
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

  trackByDay(_: number, day: DayOfWeekOption): number {
    return day.value;
  }

  trackByItemId(_: number, item: { menuItem: MenuItem; status: MenuStatus }): string {
    return item.menuItem.id;
  }

  getMenuCountForDay(day: number): number {
    return this.publishedMenus.filter(m => m.mode === 'DAY_OF_WEEK' && m.dayOfWeek === day).length;
  }

  /** Get selected date for display */
  get selectedDateDisplay(): Date | null {
    return this.menuForm.get('date')?.value || null;
  }

  /** Get selected day of week value */
  get selectedDayOfWeek(): number {
    return this.menuForm.get('dayOfWeek')?.value ?? 1;
  }
}