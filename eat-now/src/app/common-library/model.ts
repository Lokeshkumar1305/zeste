export class Login{
  emailId!: string;
  password!: string;
}
export class ENbreadcrumb {
    name!: string;
    link!: string;
}
export class Outlet {
    outletName!: string;
    outletType!: string;
    gstNumber!: string;
    fssaiNumber!: string;
    outletRegistrationType!: string;
    ownersList!: Array<Owners>;
    baseAddress!: Address;
    constructor() {
        this.ownersList = new Array<Owners>;
        this.baseAddress = new Address()
    }

}
export class Owners {
    firstName!: string;
    lastName!: string;
    dateOfBirth!: string;
    gender!: string;
    email!: string;
    mobileNumber!: string;
    aadhar!: string;
    panNumber!: string;
}
export class Address {
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    pinCode!: string;
    country!: string;
}
export class Staff {
    employeeId!: string;
    firstName!: string;
    lastName!: string;
    primaryMobileNumber!: string;
    dateOfBirth!: string;
    gender!: string;
    aadhar!: string;
    emailId!: string;
    emergencyContact: EmergencyContactInfo;
    presentAddress: Address;
    permanentAddress: Address;
    additionalStaffInfo: AdditionalStaffInfo;
    bankDetails: BankDetails;
    constructor() {
        this.emergencyContact = new EmergencyContactInfo();
        this.presentAddress = new Address();
        this.permanentAddress = new Address();
        this.additionalStaffInfo = new AdditionalStaffInfo();
        this.bankDetails = new BankDetails();
    }

}
export class EmergencyContactInfo {
    firstName!: string;
    lastName!: string;
    emergencyMobileNumber!: string;
    relation!: string;
}
export class AdditionalStaffInfo {
    role!: string;
    employmentStartDate!: string;
    employmentType!: string;
    shiftType!: string;
    shiftStartDate!: string;
    shiftEndDate!: string;
    languages!: string;
}
export class BankDetails {
    bankHolderName!: string;
    bankName!: string;
    IFSCCode!: string;
    accountType!: string;
    AccountNumber!: string;
    branch!: string;
    reAccountNumber!: string;
}
export class roelDetails {
    roleTitle!: string;
    roleDescription!: string;
    privilegeId!: Array<string>;
}
export class Table {
    area!: string;
    tableCapacity!: string;
    tableCode!: string;
    status!: string;
}

export class Variation {
    variationName!: string;
    price!: number;
  }

  export class Category {
    categoryName!: string;
    menuItems!: Menu[];
  }

  export class Menu {
    id!:string;
    itemName!: string;
    itemType!: string;
    availability!: string;
    preparationTime!: number;
    description!: string;
    price!: number;
    hasVariation!: boolean;
    variations!: Variation[];
    spiceLevel!: string;
    isRecommended!: boolean;
    isCustomizable!: boolean;
    image!: string;
    category: Category;
    variation: Variation;
    status!:string;
    constructor() {
        this.category = new Category();
        this.variation = new Variation();
    }
  }

   export class Categories {
    id!:string;
    categoryName!: string;
    description!: string;
    outletId!: string;
    image!: string;
    status!:string;
   }
export class Area {
    area_name!: string;
    noOfTables!: string
}
export class Orders {
    itemName!: string;
    brand!: string;
    category!: string;
    quantity!: string;
    supplierName!: string;
    prefferedSupplier!: string;


}




// shared/models/inventory.models.ts

export interface InventoryUnit {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
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
  minStockLevel: number;
  currentStock: number;
  unitPrice: number;
  supplierId?: string;
  supplierName?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface InventoryStock {
  id: string;
  itemId: string;
  itemName?: string;
  categoryName?: string;
  quantity: number;
  minStockLevel: number;
  location?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: Date;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName?: string;
  movementType: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Damaged' | 'Returned';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: Date;
  performedBy?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  itemsSupplied?: string[];
  rating?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName?: string;
  items: PurchaseOrderItem[];
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  deliveredDate?: Date;
  notes?: string;
  createdBy?: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  unitName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InventorySettings {
  enableAutoReorder: boolean;
  autoReorderThreshold: number;
  defaultOrderQuantity: number;
  enableEmailAlerts: boolean;
  alertEmail?: string;
  enableLowStockWarning: boolean;
  lowStockWarningDays: number;
  currency: string;
  currencySymbol: string;
}


// Inventory Report Models
export interface StockReport {
  itemId: number;
  itemName: string;
  categoryName: string;
  unitName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  stockValue: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
  lastUpdated: Date;
}

export interface MovementReport {
  id: number;
  itemName: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  fromLocation: string;
  toLocation: string;
  referenceNo: string;
  performedBy: string;
  movementDate: Date;
  remarks: string;
}

export interface PurchaseOrderReport {
  id: number;
  orderNo: string;
  supplierName: string;
  orderDate: Date;
  expectedDelivery: Date;
  totalItems: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';
  receivedDate?: Date;
}

export interface CategoryWiseReport {
  categoryId: number;
  categoryName: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export interface SupplierReport {
  supplierId: number;
  supplierName: string;
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  completedOrders: number;
  avgDeliveryDays: number;
  lastOrderDate: Date;
}

export interface ConsumptionReport {
  itemId: number;
  itemName: string;
  categoryName: string;
  openingStock: number;
  received: number;
  consumed: number;
  closingStock: number;
  avgDailyConsumption: number;
  daysRemaining: number;
}

export interface ReportFilter {
  dateFrom: Date | null;
  dateTo: Date | null;
  categoryId: number | null;
  supplierId: number | null;
  itemId: number | null;
  status: string;
  reportType: string;
}

// Inventory Settings Models
export interface InventorySettings {
  id: number;
  hostelId: number;
  
  // Auto Purchase Order Settings
  enableAutoPurchaseOrder: boolean;
  autoPOTrigger: 'LOW_STOCK' | 'REORDER_LEVEL' | 'SCHEDULE';
  autoPOSchedule: string; // Cron expression or day of week
  autoPOApprovalRequired: boolean;
  defaultSupplierId: number | null;
  
  // Stock Alert Settings
  enableLowStockAlert: boolean;
  lowStockAlertThreshold: number;
  enableOutOfStockAlert: boolean;
  enableOverstockAlert: boolean;
  alertNotificationEmail: string;
  alertNotificationSMS: boolean;
  
  // General Settings
  defaultUnitId: number | null;
  allowNegativeStock: boolean;
  requireMovementApproval: boolean;
  stockValuationMethod: 'FIFO' | 'LIFO' | 'WEIGHTED_AVG';
  enableBarcodeScanning: boolean;
  enableBatchTracking: boolean;
  enableExpiryTracking: boolean;
  expiryAlertDays: number;
  
  // Purchase Order Settings
  poNumberPrefix: string;
  poNumberStartFrom: number;
  requirePOApproval: boolean;
  poApprovalLevels: number;
  maxPOAmountWithoutApproval: number;
  
  // Display Settings
  showStockValue: boolean;
  defaultReportPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  itemsPerPage: number;
  enableDarkMode: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertThreshold {
  id: number;
  categoryId: number | null;
  categoryName: string;
  lowStockPercentage: number;
  reorderPercentage: number;
  overstockPercentage: number;
  isActive: boolean;
}

export interface AutoPORule {
  id: number;
  name: string;
  categoryId: number | null;
  supplierId: number;
  supplierName: string;
  triggerType: 'LOW_STOCK' | 'REORDER_LEVEL' | 'SCHEDULE';
  scheduleDay: string;
  isActive: boolean;
}