// inventory.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// ============ INTERFACES ============
export interface Unit {
  id: string;
  name: string;
  shortName: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  unitId: string;
  unitName?: string;
  sku: string;
  minStockLevel: number;
  currentStock: number;
  costPrice: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Stock {
  id: string;
  itemId: string;
  itemName?: string;
  quantity: number;
  location: string;
  lastUpdated: Date;
}

export interface Movement {
  id: string;
  itemId: string;
  itemName?: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: Date;
  reason: string;
  reference: string;
  performedBy: string;
  notes: string;
}

export interface Supplier {
  id: string;
  name: string;
  gst: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName?: string;
  items: PurchaseOrderItem[];
  orderDate: Date;
  expectedDate: Date;
  status: 'Draft' | 'Ordered' | 'Received' | 'Cancelled';
  totalAmount: number;
  notes: string;
  createdAt: Date;
}

export interface InventorySettings {
  enableAutoPurchaseOrder: boolean;
  lowStockThreshold: number;
  defaultUnitId: string;
  emailNotifications: boolean;
  notificationEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  
  // ============ DATA STORES ============
  private unitsSubject = new BehaviorSubject<Unit[]>([
    { id: '1', name: 'Pieces', shortName: 'pcs', description: 'Individual items', isActive: true, createdAt: new Date() },
    { id: '2', name: 'Kilograms', shortName: 'kg', description: 'Weight in kilograms', isActive: true, createdAt: new Date() },
    { id: '3', name: 'Liters', shortName: 'L', description: 'Volume in liters', isActive: true, createdAt: new Date() },
    { id: '4', name: 'Boxes', shortName: 'box', description: 'Box packaging', isActive: true, createdAt: new Date() },
    { id: '5', name: 'Packets', shortName: 'pkt', description: 'Packet packaging', isActive: true, createdAt: new Date() }
  ]);

  private categoriesSubject = new BehaviorSubject<Category[]>([
    { id: '1', name: 'Food & Beverages', description: 'All food items and drinks', parentId: null, isActive: true, createdAt: new Date() },
    { id: '2', name: 'Cleaning Supplies', description: 'Cleaning materials', parentId: null, isActive: true, createdAt: new Date() },
    { id: '3', name: 'Toiletries', description: 'Bathroom supplies', parentId: null, isActive: true, createdAt: new Date() },
    { id: '4', name: 'Stationery', description: 'Office supplies', parentId: null, isActive: true, createdAt: new Date() }
  ]);

  private itemsSubject = new BehaviorSubject<InventoryItem[]>([]);
  private stocksSubject = new BehaviorSubject<Stock[]>([]);
  private movementsSubject = new BehaviorSubject<Movement[]>([]);
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  private purchaseOrdersSubject = new BehaviorSubject<PurchaseOrder[]>([]);
  
  private settingsSubject = new BehaviorSubject<InventorySettings>({
    enableAutoPurchaseOrder: false,
    lowStockThreshold: 10,
    defaultUnitId: '1',
    emailNotifications: false,
    notificationEmail: ''
  });

  // ============ OBSERVABLES ============
  units$ = this.unitsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  items$ = this.itemsSubject.asObservable();
  stocks$ = this.stocksSubject.asObservable();
  movements$ = this.movementsSubject.asObservable();
  suppliers$ = this.suppliersSubject.asObservable();
  purchaseOrders$ = this.purchaseOrdersSubject.asObservable();
  settings$ = this.settingsSubject.asObservable();

  // ============ UNIT METHODS ============
  addUnit(unit: Omit<Unit, 'id' | 'createdAt'>): void {
    const units = this.unitsSubject.value;
    const newUnit: Unit = {
      ...unit,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.unitsSubject.next([...units, newUnit]);
  }

  updateUnit(id: string, unit: Partial<Unit>): void {
    const units = this.unitsSubject.value.map(u => 
      u.id === id ? { ...u, ...unit } : u
    );
    this.unitsSubject.next(units);
  }

  deleteUnit(id: string): void {
    const units = this.unitsSubject.value.filter(u => u.id !== id);
    this.unitsSubject.next(units);
  }

  // ============ CATEGORY METHODS ============
  addCategory(category: Omit<Category, 'id' | 'createdAt'>): void {
    const categories = this.categoriesSubject.value;
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.categoriesSubject.next([...categories, newCategory]);
  }

  updateCategory(id: string, category: Partial<Category>): void {
    const categories = this.categoriesSubject.value.map(c => 
      c.id === id ? { ...c, ...category } : c
    );
    this.categoriesSubject.next(categories);
  }

  deleteCategory(id: string): void {
    const categories = this.categoriesSubject.value.filter(c => c.id !== id);
    this.categoriesSubject.next(categories);
  }

  // ============ ITEM METHODS ============
  addItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'currentStock'>): void {
    const items = this.itemsSubject.value;
    const newItem: InventoryItem = {
      ...item,
      id: this.generateId(),
      currentStock: 0,
      createdAt: new Date()
    };
    this.itemsSubject.next([...items, newItem]);
  }

  updateItem(id: string, item: Partial<InventoryItem>): void {
    const items = this.itemsSubject.value.map(i => 
      i.id === id ? { ...i, ...item } : i
    );
    this.itemsSubject.next(items);
  }

  deleteItem(id: string): void {
    const items = this.itemsSubject.value.filter(i => i.id !== id);
    this.itemsSubject.next(items);
  }

  // ============ MOVEMENT METHODS ============
  addMovement(movement: Omit<Movement, 'id'>): void {
    const movements = this.movementsSubject.value;
    const newMovement: Movement = {
      ...movement,
      id: this.generateId()
    };
    this.movementsSubject.next([...movements, newMovement]);
    
    // Update stock
    this.updateItemStock(movement.itemId, movement.type, movement.quantity);
  }

  private updateItemStock(itemId: string, type: 'IN' | 'OUT', quantity: number): void {
    const items = this.itemsSubject.value.map(item => {
      if (item.id === itemId) {
        const newStock = type === 'IN' 
          ? item.currentStock + quantity 
          : item.currentStock - quantity;
        return { ...item, currentStock: Math.max(0, newStock) };
      }
      return item;
    });
    this.itemsSubject.next(items);
  }

  // ============ SUPPLIER METHODS ============
  addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt'>): void {
    const suppliers = this.suppliersSubject.value;
    const newSupplier: Supplier = {
      ...supplier,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.suppliersSubject.next([...suppliers, newSupplier]);
  }

  updateSupplier(id: string, supplier: Partial<Supplier>): void {
    const suppliers = this.suppliersSubject.value.map(s => 
      s.id === id ? { ...s, ...supplier } : s
    );
    this.suppliersSubject.next(suppliers);
  }

  deleteSupplier(id: string): void {
    const suppliers = this.suppliersSubject.value.filter(s => s.id !== id);
    this.suppliersSubject.next(suppliers);
  }

  // ============ PURCHASE ORDER METHODS ============
  addPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'createdAt'>): void {
    const orders = this.purchaseOrdersSubject.value;
    const newOrder: PurchaseOrder = {
      ...order,
      id: this.generateId(),
      orderNumber: this.generateOrderNumber(),
      createdAt: new Date()
    };
    this.purchaseOrdersSubject.next([...orders, newOrder]);
  }

  updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): void {
    const orders = this.purchaseOrdersSubject.value.map(o => 
      o.id === id ? { ...o, ...order } : o
    );
    this.purchaseOrdersSubject.next(orders);
  }

  // ============ SETTINGS METHODS ============
  updateSettings(settings: Partial<InventorySettings>): void {
    const current = this.settingsSubject.value;
    this.settingsSubject.next({ ...current, ...settings });
  }

  getSettings(): InventorySettings {
    return this.settingsSubject.value;
  }

  // ============ REPORT METHODS ============
  getLowStockItems(): InventoryItem[] {
    const threshold = this.settingsSubject.value.lowStockThreshold;
    return this.itemsSubject.value.filter(item => item.currentStock <= item.minStockLevel);
  }

  getTotalStockValue(): number {
    return this.itemsSubject.value.reduce((total, item) => 
      total + (item.currentStock * item.costPrice), 0
    );
  }

  // ============ UTILITY METHODS ============
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const prefix = 'PO';
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${year}${month}${random}`;
  }
}