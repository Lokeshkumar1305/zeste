// tenant-menu.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

interface MenuItem {
  id: string;
  itemName: string;
  description?: string;
  itemType: 'VEG' | 'NON_VEG' | 'EGG';
  imageUrl?: string;
  status: 'AVAILABLE' | 'COMPLETED';
}

interface Menu {
  id: string;
  mealType: string;
  date?: Date;
  dayOfWeek?: number;
  serveFrom?: string;
  serveTo?: string;
  status: 'AVAILABLE' | 'COMPLETED';
  items: MenuItem[];
  menuMode: 'DATE' | 'DAY_OF_WEEK';
  recurrence?: string;
  endDate?: Date;
}

@Component({
  selector: 'app-tenant-menu',
  templateUrl: './tenant-menu.component.html',
  styleUrls: ['./tenant-menu.component.scss']
})
export class TenantMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // View modes
  viewMode: 'today' | 'week' | 'calendar' = 'today';
  
  // Menu data
  todayMenus: Menu[] = [];
  weeklyMenus: Menu[] = [];
  selectedDate: Date = new Date();
  selectedDateMenus: Menu[] = [];
  
  // Filter
  selectedMealFilter: string = 'all';
  mealTypes = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  // Days of week
  daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' }
  ];

  currentDayOfWeek: number = new Date().getDay();
  
  // Loading state
  isLoading: boolean = false;

  // Default image
  defaultImage = 'assets/images/default-food.jpg';

  ngOnInit(): void {
    this.loadTodayMenus();
    this.loadWeeklyMenus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTodayMenus(): void {
    this.isLoading = true;

    // Simulated API call - Replace with actual service
    setTimeout(() => {
      this.todayMenus = this.getMockTodayMenus();
      this.isLoading = false;
    }, 800);
  }

  loadWeeklyMenus(): void {
    this.weeklyMenus = this.getMockWeeklyMenus();
  }

  getMockTodayMenus(): Menu[] {
    return [
      {
        id: '1',
        mealType: 'Breakfast',
        date: new Date(),
        serveFrom: '07:00',
        serveTo: '10:00',
        status: 'AVAILABLE',
        menuMode: 'DATE',
        items: [
          {
            id: 'i1',
            itemName: 'Idli Sambhar',
            description: 'Soft steamed rice cakes with lentil curry',
            itemType: 'VEG',
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
            status: 'AVAILABLE'
          },
          {
            id: 'i2',
            itemName: 'Masala Dosa',
            description: 'Crispy rice crepe with potato filling',
            itemType: 'VEG',
            imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
            status: 'AVAILABLE'
          },
          {
            id: 'i3',
            itemName: 'Coffee',
            description: 'Hot filter coffee',
            itemType: 'VEG',
            status: 'AVAILABLE'
          }
        ]
      },
      {
        id: '2',
        mealType: 'Lunch',
        date: new Date(),
        serveFrom: '12:30',
        serveTo: '15:00',
        status: 'AVAILABLE',
        menuMode: 'DATE',
        items: [
          {
            id: 'i4',
            itemName: 'Dal Tadka',
            description: 'Tempered yellow lentils',
            itemType: 'VEG',
            imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
            status: 'AVAILABLE'
          },
          {
            id: 'i5',
            itemName: 'Chicken Curry',
            description: 'Spicy chicken curry with gravy',
            itemType: 'NON_VEG',
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
            status: 'AVAILABLE'
          },
          {
            id: 'i6',
            itemName: 'Jeera Rice',
            description: 'Cumin flavored basmati rice',
            itemType: 'VEG',
            status: 'AVAILABLE'
          },
          {
            id: 'i7',
            itemName: 'Chapati',
            description: 'Whole wheat flatbread',
            itemType: 'VEG',
            status: 'AVAILABLE'
          },
          {
            id: 'i8',
            itemName: 'Curd',
            description: 'Fresh yogurt',
            itemType: 'VEG',
            status: 'AVAILABLE'
          }
        ]
      },
      {
        id: '3',
        mealType: 'Dinner',
        date: new Date(),
        serveFrom: '19:30',
        serveTo: '22:00',
        status: 'AVAILABLE',
        menuMode: 'DATE',
        items: [
          {
            id: 'i9',
            itemName: 'Paneer Butter Masala',
            description: 'Cottage cheese in creamy tomato gravy',
            itemType: 'VEG',
            imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
            status: 'AVAILABLE'
          },
          {
            id: 'i10',
            itemName: 'Naan',
            description: 'Leavened flatbread',
            itemType: 'VEG',
            status: 'AVAILABLE'
          },
          {
            id: 'i11',
            itemName: 'Mixed Vegetable',
            description: 'Seasonal vegetables curry',
            itemType: 'VEG',
            status: 'AVAILABLE'
          }
        ]
      }
    ];
  }

  getMockWeeklyMenus(): Menu[] {
    return [
      {
        id: 'w1',
        mealType: 'Breakfast',
        dayOfWeek: 1, // Monday
        serveFrom: '07:00',
        serveTo: '10:00',
        status: 'AVAILABLE',
        menuMode: 'DAY_OF_WEEK',
        items: [
          {
            id: 'wi1',
            itemName: 'Poha',
            description: 'Flattened rice with spices',
            itemType: 'VEG',
            status: 'AVAILABLE'
          },
          {
            id: 'wi2',
            itemName: 'Tea',
            description: 'Hot masala tea',
            itemType: 'VEG',
            status: 'AVAILABLE'
          }
        ]
      },
      {
        id: 'w2',
        mealType: 'Lunch',
        dayOfWeek: 1,
        serveFrom: '12:30',
        serveTo: '15:00',
        status: 'AVAILABLE',
        menuMode: 'DAY_OF_WEEK',
        items: [
          {
            id: 'wi3',
            itemName: 'Rajma Curry',
            description: 'Red kidney beans curry',
            itemType: 'VEG',
            status: 'AVAILABLE'
          },
          {
            id: 'wi4',
            itemName: 'Rice',
            description: 'Steamed basmati rice',
            itemType: 'VEG',
            status: 'AVAILABLE'
          }
        ]
      }
    ];
  }

  // View mode changes
  changeViewMode(mode: 'today' | 'week' | 'calendar'): void {
    this.viewMode = mode;
    
    if (mode === 'today') {
      this.loadTodayMenus();
    }
  }

  // Filter
  filterByMealType(mealType: string): void {
    this.selectedMealFilter = mealType;
  }

  getFilteredMenus(menus: Menu[]): Menu[] {
    if (this.selectedMealFilter === 'all') {
      return menus;
    }
    return menus.filter(m => m.mealType === this.selectedMealFilter);
  }

  // Get menus for specific day of week
  getMenusForDay(dayOfWeek: number): Menu[] {
    return this.weeklyMenus.filter(m => m.dayOfWeek === dayOfWeek);
  }

  // Utility functions
  getMealIcon(mealType: string): string {
    const icons: any = {
      'Breakfast': 'free_breakfast',
      'Lunch': 'lunch_dining',
      'Dinner': 'dinner_dining',
      'Snacks': 'local_cafe'
    };
    return icons[mealType] || 'restaurant';
  }

  getItemTypeClass(itemType: string): string {
    return itemType.toLowerCase().replace('_', '-');
  }

  getItemTypeDot(itemType: string): string {
    return itemType === 'VEG' ? '🟢' : itemType === 'NON_VEG' ? '🔴' : '🟡';
  }

  isMenuAvailable(menu: Menu): boolean {
    if (menu.status !== 'AVAILABLE') return false;
    
    if (menu.menuMode === 'DATE') {
      // Check if menu is for today
      const today = new Date();
      const menuDate = menu.date ? new Date(menu.date) : null;
      if (!menuDate) return false;
      
      return menuDate.toDateString() === today.toDateString();
    }
    
    return true;
  }

  isMenuServing(menu: Menu): boolean {
    if (!this.isMenuAvailable(menu)) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    if (menu.serveFrom && menu.serveTo) {
      const [fromHour, fromMin] = menu.serveFrom.split(':').map(Number);
      const [toHour, toMin] = menu.serveTo.split(':').map(Number);
      
      const fromTime = fromHour * 60 + fromMin;
      const toTime = toHour * 60 + toMin;
      
      return currentTime >= fromTime && currentTime <= toTime;
    }
    
    return false;
  }

  getMenuTimingStatus(menu: Menu): 'upcoming' | 'serving' | 'completed' {
    if (!this.isMenuAvailable(menu)) return 'completed';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    if (menu.serveFrom && menu.serveTo) {
      const [fromHour, fromMin] = menu.serveFrom.split(':').map(Number);
      const [toHour, toMin] = menu.serveTo.split(':').map(Number);
      
      const fromTime = fromHour * 60 + fromMin;
      const toTime = toHour * 60 + toMin;
      
      if (currentTime < fromTime) return 'upcoming';
      if (currentTime >= fromTime && currentTime <= toTime) return 'serving';
      return 'completed';
    }
    
    return 'upcoming';
  }

  getDayLabel(dayValue: number): string {
    const day = this.daysOfWeek.find(d => d.value === dayValue);
    return day ? day.label : '';
  }

  refreshMenus(): void {
    this.loadTodayMenus();
    this.loadWeeklyMenus();
  }

  trackByMenuId(index: number, menu: Menu): string {
    return menu.id;
  }

  trackByItemId(index: number, item: MenuItem): string {
    return item.id;
  }

  trackByDay(index: number, day: any): number {
    return day.value;
  }
}