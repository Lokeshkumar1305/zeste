import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockReport, MovementReport, PurchaseOrderReport, CategoryWiseReport, SupplierReport, ConsumptionReport } from '../../common-library/model';


@Component({
  selector: 'app-inventory-reports',
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.scss']
})
export class InventoryReportsComponent implements OnInit {

  // Report Types
  reportTypes = [
    { value: 'stock', label: 'Stock Report', icon: 'inventory_2' },
    { value: 'movement', label: 'Movement Report', icon: 'swap_horiz' },
    { value: 'purchase', label: 'Purchase Order Report', icon: 'shopping_cart' },
    { value: 'category', label: 'Category Wise Report', icon: 'category' },
    { value: 'supplier', label: 'Supplier Report', icon: 'local_shipping' },
    { value: 'consumption', label: 'Consumption Report', icon: 'trending_down' },
    { value: 'lowstock', label: 'Low Stock Alert', icon: 'warning' },
    { value: 'expiry', label: 'Expiry Report', icon: 'event_busy' }
  ];

  selectedReportType = 'stock';
  filterForm!: FormGroup;
  isLoading = false;

  // Data Sources
  stockDataSource = new MatTableDataSource<StockReport>([]);
  movementDataSource = new MatTableDataSource<MovementReport>([]);
  purchaseDataSource = new MatTableDataSource<PurchaseOrderReport>([]);
  categoryDataSource = new MatTableDataSource<CategoryWiseReport>([]);
  supplierDataSource = new MatTableDataSource<SupplierReport>([]);
  consumptionDataSource = new MatTableDataSource<ConsumptionReport>([]);

  // Column Definitions
  stockColumns = ['itemName', 'categoryName', 'currentStock', 'minStock', 'reorderLevel', 'stockValue', 'status', 'lastUpdated'];
  movementColumns = ['movementDate', 'itemName', 'movementType', 'quantity', 'fromLocation', 'toLocation', 'performedBy', 'remarks'];
  purchaseColumns = ['orderNo', 'supplierName', 'orderDate', 'expectedDelivery', 'totalItems', 'totalAmount', 'status'];
  categoryColumns = ['categoryName', 'totalItems', 'totalQuantity', 'totalValue', 'lowStockItems', 'outOfStockItems'];
  supplierColumns = ['supplierName', 'totalOrders', 'totalAmount', 'pendingOrders', 'completedOrders', 'avgDeliveryDays', 'lastOrderDate'];
  consumptionColumns = ['itemName', 'categoryName', 'openingStock', 'received', 'consumed', 'closingStock', 'avgDailyConsumption', 'daysRemaining'];

  @ViewChild('stockPaginator') stockPaginator!: MatPaginator;
  @ViewChild('movementPaginator') movementPaginator!: MatPaginator;
  @ViewChild('purchasePaginator') purchasePaginator!: MatPaginator;
  @ViewChild('categoryPaginator') categoryPaginator!: MatPaginator;
  @ViewChild('supplierPaginator') supplierPaginator!: MatPaginator;
  @ViewChild('consumptionPaginator') consumptionPaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  // Filter Options
  categories = [
    { id: 1, name: 'Food & Groceries' },
    { id: 2, name: 'Cleaning Supplies' },
    { id: 3, name: 'Furniture' },
    { id: 4, name: 'Electronics' },
    { id: 5, name: 'Stationery' },
    { id: 6, name: 'Bedding & Linens' }
  ];

  suppliers = [
    { id: 1, name: 'ABC Suppliers' },
    { id: 2, name: 'XYZ Trading' },
    { id: 3, name: 'Metro Wholesale' },
    { id: 4, name: 'City Distributors' }
  ];

  items = [
    { id: 1, name: 'Rice' },
    { id: 2, name: 'Cooking Oil' },
    { id: 3, name: 'Detergent' },
    { id: 4, name: 'Bed Sheets' }
  ];

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'In Stock', label: 'In Stock' },
    { value: 'Low Stock', label: 'Low Stock' },
    { value: 'Out of Stock', label: 'Out of Stock' },
    { value: 'Overstocked', label: 'Overstocked' }
  ];

  // Summary Cards Data
  summaryData = {
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalMovements: 0,
    pendingOrders: 0
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.loadReportData();
  }

  initFilterForm(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filterForm = this.fb.group({
      dateFrom: [firstDayOfMonth],
      dateTo: [today],
      categoryId: [null],
      supplierId: [null],
      itemId: [null],
      status: ['']
    });
  }

  onReportTypeChange(type: string): void {
    this.selectedReportType = type;
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      switch (this.selectedReportType) {
        case 'stock':
        case 'lowstock':
          this.loadStockReport();
          break;
        case 'movement':
          this.loadMovementReport();
          break;
        case 'purchase':
          this.loadPurchaseReport();
          break;
        case 'category':
          this.loadCategoryReport();
          break;
        case 'supplier':
          this.loadSupplierReport();
          break;
        case 'consumption':
          this.loadConsumptionReport();
          break;
      }
      this.isLoading = false;
    }, 500);
  }

  loadStockReport(): void {
    const stockData: StockReport[] = [
      {
        itemId: 1,
        itemName: 'Rice (Basmati)',
        categoryName: 'Food & Groceries',
        unitName: 'Kg',
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        reorderLevel: 100,
        stockValue: 15000,
        status: 'In Stock',
        lastUpdated: new Date('2024-01-15')
      },
      {
        itemId: 2,
        itemName: 'Cooking Oil',
        categoryName: 'Food & Groceries',
        unitName: 'Litre',
        currentStock: 25,
        minStock: 30,
        maxStock: 200,
        reorderLevel: 50,
        stockValue: 3750,
        status: 'Low Stock',
        lastUpdated: new Date('2024-01-14')
      },
      {
        itemId: 3,
        itemName: 'Detergent Powder',
        categoryName: 'Cleaning Supplies',
        unitName: 'Kg',
        currentStock: 0,
        minStock: 20,
        maxStock: 100,
        reorderLevel: 30,
        stockValue: 0,
        status: 'Out of Stock',
        lastUpdated: new Date('2024-01-10')
      },
      {
        itemId: 4,
        itemName: 'Bed Sheets (Single)',
        categoryName: 'Bedding & Linens',
        unitName: 'Piece',
        currentStock: 200,
        minStock: 50,
        maxStock: 150,
        reorderLevel: 75,
        stockValue: 60000,
        status: 'Overstocked',
        lastUpdated: new Date('2024-01-16')
      },
      {
        itemId: 5,
        itemName: 'Toilet Cleaner',
        categoryName: 'Cleaning Supplies',
        unitName: 'Litre',
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        reorderLevel: 35,
        stockValue: 2250,
        status: 'In Stock',
        lastUpdated: new Date('2024-01-15')
      },
      {
        itemId: 6,
        itemName: 'Sugar',
        categoryName: 'Food & Groceries',
        unitName: 'Kg',
        currentStock: 80,
        minStock: 30,
        maxStock: 200,
        reorderLevel: 50,
        stockValue: 4000,
        status: 'In Stock',
        lastUpdated: new Date('2024-01-15')
      },
      {
        itemId: 7,
        itemName: 'Pillow Cover',
        categoryName: 'Bedding & Linens',
        unitName: 'Piece',
        currentStock: 15,
        minStock: 25,
        maxStock: 100,
        reorderLevel: 40,
        stockValue: 1500,
        status: 'Low Stock',
        lastUpdated: new Date('2024-01-12')
      },
      {
        itemId: 8,
        itemName: 'Floor Cleaner',
        categoryName: 'Cleaning Supplies',
        unitName: 'Litre',
        currentStock: 60,
        minStock: 25,
        maxStock: 150,
        reorderLevel: 40,
        stockValue: 3600,
        status: 'In Stock',
        lastUpdated: new Date('2024-01-14')
      }
    ];

    // Filter for low stock if needed
    let filteredData = stockData;
    if (this.selectedReportType === 'lowstock') {
      filteredData = stockData.filter(item =>
        item.status === 'Low Stock' || item.status === 'Out of Stock'
      );
    }

    this.stockDataSource.data = filteredData;
    this.updateSummary(stockData);

    setTimeout(() => {
      this.stockDataSource.paginator = this.stockPaginator;
      this.stockDataSource.sort = this.sort;
    });
  }

  loadMovementReport(): void {
    const movementData: MovementReport[] = [
      {
        id: 1,
        itemName: 'Rice (Basmati)',
        movementType: 'IN',
        quantity: 100,
        fromLocation: 'Supplier',
        toLocation: 'Main Store',
        referenceNo: 'PO-2024-001',
        performedBy: 'John Doe',
        movementDate: new Date('2024-01-15'),
        remarks: 'Regular purchase'
      },
      {
        id: 2,
        itemName: 'Cooking Oil',
        movementType: 'OUT',
        quantity: 20,
        fromLocation: 'Main Store',
        toLocation: 'Kitchen',
        referenceNo: 'ISS-2024-045',
        performedBy: 'Jane Smith',
        movementDate: new Date('2024-01-15'),
        remarks: 'Weekly kitchen supply'
      },
      {
        id: 3,
        itemName: 'Detergent Powder',
        movementType: 'OUT',
        quantity: 15,
        fromLocation: 'Main Store',
        toLocation: 'Housekeeping',
        referenceNo: 'ISS-2024-046',
        performedBy: 'Mike Johnson',
        movementDate: new Date('2024-01-14'),
        remarks: 'Cleaning supplies'
      },
      {
        id: 4,
        itemName: 'Bed Sheets (Single)',
        movementType: 'TRANSFER',
        quantity: 50,
        fromLocation: 'Main Store',
        toLocation: 'Block A Store',
        referenceNo: 'TRF-2024-012',
        performedBy: 'Sarah Wilson',
        movementDate: new Date('2024-01-14'),
        remarks: 'Block A requirement'
      },
      {
        id: 5,
        itemName: 'Sugar',
        movementType: 'ADJUSTMENT',
        quantity: -5,
        fromLocation: 'Main Store',
        toLocation: 'Main Store',
        referenceNo: 'ADJ-2024-003',
        performedBy: 'Admin',
        movementDate: new Date('2024-01-13'),
        remarks: 'Stock adjustment - damaged goods'
      },
      {
        id: 6,
        itemName: 'Toilet Cleaner',
        movementType: 'IN',
        quantity: 30,
        fromLocation: 'Supplier',
        toLocation: 'Main Store',
        referenceNo: 'PO-2024-002',
        performedBy: 'John Doe',
        movementDate: new Date('2024-01-12'),
        remarks: 'Emergency purchase'
      }
    ];

    this.movementDataSource.data = movementData;
    this.summaryData.totalMovements = movementData.length;

    setTimeout(() => {
      this.movementDataSource.paginator = this.movementPaginator;
      this.movementDataSource.sort = this.sort;
    });
  }

  loadPurchaseReport(): void {
    const purchaseData: PurchaseOrderReport[] = [
      {
        id: 1,
        orderNo: 'PO-2024-001',
        supplierName: 'ABC Suppliers',
        orderDate: new Date('2024-01-10'),
        expectedDelivery: new Date('2024-01-15'),
        totalItems: 5,
        totalAmount: 25000,
        status: 'Received',
        receivedDate: new Date('2024-01-14')
      },
      {
        id: 2,
        orderNo: 'PO-2024-002',
        supplierName: 'XYZ Trading',
        orderDate: new Date('2024-01-12'),
        expectedDelivery: new Date('2024-01-18'),
        totalItems: 3,
        totalAmount: 15000,
        status: 'Ordered'
      },
      {
        id: 3,
        orderNo: 'PO-2024-003',
        supplierName: 'Metro Wholesale',
        orderDate: new Date('2024-01-14'),
        expectedDelivery: new Date('2024-01-20'),
        totalItems: 8,
        totalAmount: 45000,
        status: 'Approved'
      },
      {
        id: 4,
        orderNo: 'PO-2024-004',
        supplierName: 'City Distributors',
        orderDate: new Date('2024-01-15'),
        expectedDelivery: new Date('2024-01-22'),
        totalItems: 4,
        totalAmount: 18500,
        status: 'Pending'
      },
      {
        id: 5,
        orderNo: 'PO-2024-005',
        supplierName: 'ABC Suppliers',
        orderDate: new Date('2024-01-08'),
        expectedDelivery: new Date('2024-01-12'),
        totalItems: 2,
        totalAmount: 8000,
        status: 'Cancelled'
      }
    ];

    this.purchaseDataSource.data = purchaseData;
    this.summaryData.pendingOrders = purchaseData.filter(p =>
      p.status === 'Pending' || p.status === 'Approved' || p.status === 'Ordered'
    ).length;

    setTimeout(() => {
      this.purchaseDataSource.paginator = this.purchasePaginator;
      this.purchaseDataSource.sort = this.sort;
    });
  }

  loadCategoryReport(): void {
    const categoryData: CategoryWiseReport[] = [
      {
        categoryId: 1,
        categoryName: 'Food & Groceries',
        totalItems: 25,
        totalQuantity: 1500,
        totalValue: 75000,
        lowStockItems: 3,
        outOfStockItems: 1
      },
      {
        categoryId: 2,
        categoryName: 'Cleaning Supplies',
        totalItems: 15,
        totalQuantity: 450,
        totalValue: 22500,
        lowStockItems: 2,
        outOfStockItems: 2
      },
      {
        categoryId: 3,
        categoryName: 'Bedding & Linens',
        totalItems: 12,
        totalQuantity: 350,
        totalValue: 105000,
        lowStockItems: 1,
        outOfStockItems: 0
      },
      {
        categoryId: 4,
        categoryName: 'Furniture',
        totalItems: 8,
        totalQuantity: 120,
        totalValue: 240000,
        lowStockItems: 0,
        outOfStockItems: 0
      },
      {
        categoryId: 5,
        categoryName: 'Electronics',
        totalItems: 10,
        totalQuantity: 85,
        totalValue: 170000,
        lowStockItems: 1,
        outOfStockItems: 1
      },
      {
        categoryId: 6,
        categoryName: 'Stationery',
        totalItems: 20,
        totalQuantity: 2000,
        totalValue: 15000,
        lowStockItems: 4,
        outOfStockItems: 2
      }
    ];

    this.categoryDataSource.data = categoryData;

    setTimeout(() => {
      this.categoryDataSource.paginator = this.categoryPaginator;
      this.categoryDataSource.sort = this.sort;
    });
  }

  loadSupplierReport(): void {
    const supplierData: SupplierReport[] = [
      {
        supplierId: 1,
        supplierName: 'ABC Suppliers',
        totalOrders: 45,
        totalAmount: 450000,
        pendingOrders: 2,
        completedOrders: 42,
        avgDeliveryDays: 3,
        lastOrderDate: new Date('2024-01-15')
      },
      {
        supplierId: 2,
        supplierName: 'XYZ Trading',
        totalOrders: 30,
        totalAmount: 280000,
        pendingOrders: 1,
        completedOrders: 28,
        avgDeliveryDays: 5,
        lastOrderDate: new Date('2024-01-12')
      },
      {
        supplierId: 3,
        supplierName: 'Metro Wholesale',
        totalOrders: 25,
        totalAmount: 520000,
        pendingOrders: 3,
        completedOrders: 21,
        avgDeliveryDays: 4,
        lastOrderDate: new Date('2024-01-14')
      },
      {
        supplierId: 4,
        supplierName: 'City Distributors',
        totalOrders: 18,
        totalAmount: 165000,
        pendingOrders: 1,
        completedOrders: 16,
        avgDeliveryDays: 6,
        lastOrderDate: new Date('2024-01-10')
      }
    ];

    this.supplierDataSource.data = supplierData;

    setTimeout(() => {
      this.supplierDataSource.paginator = this.supplierPaginator;
      this.supplierDataSource.sort = this.sort;
    });
  }

  loadConsumptionReport(): void {
    const consumptionData: ConsumptionReport[] = [
      {
        itemId: 1,
        itemName: 'Rice (Basmati)',
        categoryName: 'Food & Groceries',
        openingStock: 100,
        received: 200,
        consumed: 150,
        closingStock: 150,
        avgDailyConsumption: 10,
        daysRemaining: 15
      },
      {
        itemId: 2,
        itemName: 'Cooking Oil',
        categoryName: 'Food & Groceries',
        openingStock: 50,
        received: 30,
        consumed: 55,
        closingStock: 25,
        avgDailyConsumption: 4,
        daysRemaining: 6
      },
      {
        itemId: 3,
        itemName: 'Sugar',
        categoryName: 'Food & Groceries',
        openingStock: 60,
        received: 50,
        consumed: 30,
        closingStock: 80,
        avgDailyConsumption: 2,
        daysRemaining: 40
      },
      {
        itemId: 4,
        itemName: 'Detergent Powder',
        categoryName: 'Cleaning Supplies',
        openingStock: 25,
        received: 0,
        consumed: 25,
        closingStock: 0,
        avgDailyConsumption: 2,
        daysRemaining: 0
      },
      {
        itemId: 5,
        itemName: 'Toilet Cleaner',
        categoryName: 'Cleaning Supplies',
        openingStock: 30,
        received: 30,
        consumed: 15,
        closingStock: 45,
        avgDailyConsumption: 1,
        daysRemaining: 45
      }
    ];

    this.consumptionDataSource.data = consumptionData;

    setTimeout(() => {
      this.consumptionDataSource.paginator = this.consumptionPaginator;
      this.consumptionDataSource.sort = this.sort;
    });
  }

  updateSummary(stockData: StockReport[]): void {
    this.summaryData.totalItems = stockData.length;
    this.summaryData.totalValue = stockData.reduce((sum, item) => sum + item.stockValue, 0);
    this.summaryData.lowStockItems = stockData.filter(item => item.status === 'Low Stock').length;
    this.summaryData.outOfStockItems = stockData.filter(item => item.status === 'Out of Stock').length;
  }

  applyFilter(): void {
    this.loadReportData();
    this.showNotification('Filters applied successfully');
  }

  resetFilters(): void {
    this.initFilterForm();
    this.loadReportData();
    this.showNotification('Filters reset successfully');
  }

  applyTableFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel(): void {
    this.showNotification('Exporting to Excel...');
    // Implement actual Excel export logic
  }

  exportToPDF(): void {
    this.showNotification('Exporting to PDF...');
    // Implement actual PDF export logic
  }

  printReport(): void {
    window.print();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'status-success';
      case 'Low Stock':
        return 'status-warning';
      case 'Out of Stock':
        return 'status-danger';
      case 'Overstocked':
        return 'status-info';
      case 'Received':
      case 'Approved':
        return 'status-success';
      case 'Pending':
      case 'Ordered':
        return 'status-warning';
      case 'Cancelled':
        return 'status-danger';
      default:
        return '';
    }
  }

  getMovementTypeClass(type: string): string {
    switch (type) {
      case 'IN':
        return 'movement-in';
      case 'OUT':
        return 'movement-out';
      case 'TRANSFER':
        return 'movement-transfer';
      case 'ADJUSTMENT':
        return 'movement-adjustment';
      default:
        return '';
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }


  // ---------- Custom paginator helpers (design only) ----------



  getPageNumbers(paginator: MatPaginator | null | undefined): number[] {
    if (!paginator) {
      return [];
    }
    const length = paginator.length ?? 0;
    const pageSize = paginator.pageSize || 0;

    if (length === 0 || pageSize === 0) {
      return [];
    }

    const totalPages = Math.ceil(length / pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  hasPreviousPage(paginator: MatPaginator | null | undefined): boolean {
    return !!paginator && paginator.pageIndex > 0;
  }

  hasNextPage(paginator: MatPaginator | null | undefined): boolean {
    if (!paginator) {
      return false;
    }
    const length = paginator.length ?? 0;
    const pageSize = paginator.pageSize || 0;

    if (length === 0 || pageSize === 0) {
      return false;
    }

    const totalPages = Math.ceil(length / pageSize);
    return paginator.pageIndex < totalPages - 1;
  }

  goToPreviousPage(paginator: MatPaginator | null | undefined): void {
    if (paginator && this.hasPreviousPage(paginator)) {
      paginator.previousPage();
    }
  }

  goToNextPage(paginator: MatPaginator | null | undefined): void {
    if (paginator && this.hasNextPage(paginator)) {
      paginator.nextPage();
    }
  }

  goToPage(
    paginator: MatPaginator | null | undefined,
    pageIndex: number
  ): void {
    if (!paginator) {
      return;
    }
    const length = paginator.length ?? 0;
    const pageSize = paginator.pageSize || 0;

    if (length === 0 || pageSize === 0) {
      return;
    }

    const totalPages = Math.ceil(length / pageSize);
    if (pageIndex < 0 || pageIndex >= totalPages) {
      return;
    }

    paginator.pageIndex = pageIndex;
    // Force MatPaginator to emit a page event so MatTableDataSource updates.
    (paginator as any)._changePageSize(paginator.pageSize);
  }

  onCustomPageSizeChange(
    paginator: MatPaginator | null | undefined,
    value: string | number
  ): void {
    if (!paginator) {
      return;
    }
    const newSize = Number(value);
    if (!newSize) {
      return;
    }
    (paginator as any)._changePageSize(newSize);
  }

  getCustomRangeLabel(paginator: MatPaginator | null | undefined): string {
    if (!paginator || !paginator.length) {
      return 'Showing 0 to 0 of 0 entries';
    }
    const startIndex = paginator.pageIndex * paginator.pageSize;
    const endIndex = Math.min(startIndex + paginator.pageSize, paginator.length);
    return `Showing ${startIndex + 1} to ${endIndex} of ${paginator.length} entries`;
  }

}