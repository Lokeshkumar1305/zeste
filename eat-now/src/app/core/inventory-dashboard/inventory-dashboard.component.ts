import { Component, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface InventoryItem {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  currentStock: number;
  minStockLevel: number;
  unitName: string;
  costPrice?: number;
}

interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';
  orderDate: Date;
  totalAmount: number;
}

interface StockMovement {
  id: number;
  itemId: number;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: Date;
}

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss'],
})
export class InventoryDashboardComponent implements OnInit {
  categories: Category[] = [
    { id: 1, name: 'Food & Groceries' },
    { id: 2, name: 'Cleaning Supplies' },
    { id: 3, name: 'Linen & Laundry' },
    { id: 4, name: 'Miscellaneous' },
  ];

  suppliers: Supplier[] = [
    { id: 1, name: 'Reliance Fresh' },
    { id: 2, name: 'Local Kirana' },
    { id: 3, name: 'Online Supplier' },
  ];

  items: InventoryItem[] = [
    {
      id: 1,
      name: 'Basmati Rice',
      categoryId: 1,
      categoryName: 'Food & Groceries',
      currentStock: 80,
      minStockLevel: 50,
      unitName: 'kg',
      costPrice: 80,
    },
    {
      id: 2,
      name: 'Toor Dal',
      categoryId: 1,
      categoryName: 'Food & Groceries',
      currentStock: 30,
      minStockLevel: 60,
      unitName: 'kg',
      costPrice: 110,
    },
    {
      id: 3,
      name: 'Cooking Oil',
      categoryId: 1,
      categoryName: 'Food & Groceries',
      currentStock: 10,
      minStockLevel: 20,
      unitName: 'L',
      costPrice: 140,
    },
    {
      id: 4,
      name: 'Floor Cleaner',
      categoryId: 2,
      categoryName: 'Cleaning Supplies',
      currentStock: 0,
      minStockLevel: 10,
      unitName: 'bottle',
      costPrice: 90,
    },
    {
      id: 5,
      name: 'Bedsheets',
      categoryId: 3,
      categoryName: 'Linen & Laundry',
      currentStock: 40,
      minStockLevel: 30,
      unitName: 'pcs',
      costPrice: 450,
    },
  ];

  purchaseOrders: PurchaseOrder[] = [
    {
      id: 1001,
      supplierId: 1,
      supplierName: 'Reliance Fresh',
      status: 'Pending',
      orderDate: new Date('2025-12-19'),
      totalAmount: 14500,
    },
    {
      id: 1002,
      supplierId: 2,
      supplierName: 'Local Kirana',
      status: 'Ordered',
      orderDate: new Date('2025-12-18'),
      totalAmount: 7200,
    },
    {
      id: 1003,
      supplierId: 3,
      supplierName: 'Online Supplier',
      status: 'Received',
      orderDate: new Date('2025-12-17'),
      totalAmount: 9800,
    },
  ];

  stockMovements: StockMovement[] = [
    {
      id: 1,
      itemId: 1,
      itemName: 'Basmati Rice',
      type: 'IN',
      quantity: 50,
      date: new Date('2025-12-15'),
    },
    {
      id: 2,
      itemId: 2,
      itemName: 'Toor Dal',
      type: 'OUT',
      quantity: 15,
      date: new Date('2025-12-16'),
    },
    {
      id: 3,
      itemId: 3,
      itemName: 'Cooking Oil',
      type: 'IN',
      quantity: 20,
      date: new Date('2025-12-17'),
    },
    {
      id: 4,
      itemId: 4,
      itemName: 'Floor Cleaner',
      type: 'OUT',
      quantity: 5,
      date: new Date('2025-12-18'),
    },
  ];

  totalItems = 0;
  totalCategories = 0;
  totalSuppliers = 0;
  totalStockValue = 0;
  lowStockCount = 0;
  outOfStockCount = 0;
  pendingOrderCount = 0;

  lowStockItems: InventoryItem[] = [];
  outOfStockItems: InventoryItem[] = [];
  alertItems: InventoryItem[] = [];

  stockByCategoryData!: ChartConfiguration<'bar'>['data'];
  stockByCategoryOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { maxRotation: 0, minRotation: 0 } },
      y: { beginAtZero: true },
    },
  };

  stockStatusData!: ChartConfiguration<'doughnut'>['data'];
  stockStatusOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  ngOnInit(): void {
    this.calculateStats();
    this.buildCharts();
  }

  private calculateStats(): void {
    this.totalItems = this.items.length;
    this.totalCategories = this.categories.length;
    this.totalSuppliers = this.suppliers.length;

    this.totalStockValue = this.items.reduce(
      (sum, item) => sum + (item.costPrice || 0) * item.currentStock,
      0
    );

    this.lowStockItems = this.items.filter(
      (i) => i.currentStock > 0 && i.currentStock <= i.minStockLevel
    );
    this.outOfStockItems = this.items.filter((i) => i.currentStock === 0);

    this.lowStockCount = this.lowStockItems.length;
    this.outOfStockCount = this.outOfStockItems.length;

    this.pendingOrderCount = this.purchaseOrders.filter((po) =>
      ['Pending', 'Approved', 'Ordered'].includes(po.status)
    ).length;

    this.alertItems = this.lowStockItems.concat(this.outOfStockItems);
  }

  private buildCharts(): void {
    const categoryLabels = this.categories.map((c) => c.name);
    const categoryStock = this.categories.map((cat) =>
      this.items
        .filter((i) => i.categoryId === cat.id)
        .reduce((sum, i) => sum + i.currentStock, 0)
    );

    this.stockByCategoryData = {
      labels: categoryLabels,
      datasets: [
        {
          data: categoryStock,
          backgroundColor: '#003B8A',
          hoverBackgroundColor: '#002B61',
          borderRadius: 6,
          maxBarThickness: 40,
        },
      ],
    };

    const okCount = this.items.filter(
      (i) => i.currentStock > i.minStockLevel
    ).length;
    const lowCount = this.lowStockCount;
    const outCount = this.outOfStockCount;

    this.stockStatusData = {
      labels: ['In Stock', 'Low Stock', 'Out of Stock'],
      datasets: [
        {
          data: [okCount, lowCount, outCount],
          backgroundColor: ['#16a34a', '#d97706', '#dc2626'],
          hoverBackgroundColor: ['#15803d', '#b45309', '#b91c1c'],
        },
      ],
    };
  }

  getStockStatus(item: InventoryItem): 'ok' | 'low' | 'out' {
    if (item.currentStock === 0) return 'out';
    if (item.currentStock <= item.minStockLevel) return 'low';
    return 'ok';
  }

  getStockStatusText(item: InventoryItem): string {
    const status = this.getStockStatus(item);
    if (status === 'out') return 'Out of Stock';
    if (status === 'low') return 'Low Stock';
    return 'In Stock';
  }

  get recentPurchaseOrders(): PurchaseOrder[] {
    return this.purchaseOrders
      .slice()
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
      .slice(0, 5);
  }

  get recentMovements(): StockMovement[] {
    return this.stockMovements
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }

  onAddItem(): void { }
  onAddCategory(): void { }
  onAddSupplier(): void { }
  onAddUnit(): void { }
  onStockMovement(): void { }
  onCreatePO(): void { }
}