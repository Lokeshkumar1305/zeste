import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutletOnboardingComponent } from './outlet-onboarding/outlet-onboarding.component';
import { MerchantStaffOnboardingComponent } from './merchant-staff-onboarding/merchant-staff-onboarding.component';
import { StaffOnboardingComponent } from './staff-onboarding/staff-onboarding.component';
import { StaffOnboardingGetAllComponent } from './staff-onboarding-get-all/staff-onboarding-get-all.component';
import { OutletsComponent } from './outlets/outlets.component';
import { AreaComponent } from './area/area.component';
import { TableComponent } from './table/table.component';
import { StockMomentComponent } from './stock-moment/stock-moment.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { ItemsComponent } from './items/items.component';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';
import { MenuComponent } from './menu/menu.component';
import { CategoryComponent } from './category/category.component';
import { BillingComponent } from './billing/billing.component';
import { RoomManagementComponent } from './room-management/room-management.component';
import { TenantManagementComponent } from './tenant-management/tenant-management.component';
import { PaymentManagementComponent } from './payment-management/payment-management.component';
import { MaintenanceManagementComponent } from './maintenance-management/maintenance-management.component';
import { ExpensesManagementComponent } from './expenses-management/expenses-management.component';
import { RoomTypeManagementComponent } from './room-type-management/room-type-management.component';
import { FloorsManagementComponent } from './floors-management/floors-management.component';
import { BedsManagementComponent } from './beds-management/beds-management.component';
import { AmenitiesManagementComponent } from './amenities-management/amenities-management.component';
import { MaintenanceCategoryComponent } from './maintenance-category/maintenance-category.component';
import { ExpensesCategoryComponent } from './expenses-category/expenses-category.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { InventoryUnitsComponent } from './inventory-units/inventory-units.component';
import { InventoryItemsComponent } from './inventory-items/inventory-items.component';
import { InventoryItemsCategoriesComponent } from './inventory-items-categories/inventory-items-categories.component';
import { InventoryStocksComponent } from './inventory-stocks/inventory-stocks.component';
import { InventoryMovementsComponent } from './inventory-movements/inventory-movements.component';
import { InventoryPurchaseOrdersComponent } from './inventory-purchase-orders/inventory-purchase-orders.component';
import { InventorySuppliersComponent } from './inventory-suppliers/inventory-suppliers.component';
import { InventoryReportsComponent } from './inventory-reports/inventory-reports.component';
import { InventorySettingsComponent } from './inventory-settings/inventory-settings.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { SubscriptionPackagesComponent } from './subscription-packages/subscription-packages.component';
import { SubscriptionPackagesModalComponent } from './subscription-packages-modal/subscription-packages-modal.component';
import { SubscriptionBillingHistoryComponent } from './subscription-billing-history/subscription-billing-history.component';

const routes: Routes = [
  { path: 'outlet-onboarding', component: OutletOnboardingComponent },
  { path: 'merchant-staff-onboarding', component: MerchantStaffOnboardingComponent },
  { path: 'staff-onboarding', component: StaffOnboardingComponent },
  { path: 'staff-onboarding-getAll', component: StaffOnboardingGetAllComponent },
  { path: 'outlet-getAll', component: OutletsComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'purchase-order', component: PurchaseOrdersComponent },
  { path: 'supplier', component: SuppliersComponent },
  { path: 'stock-moment', component: StockMomentComponent },
  { path: 'purchase-order-details', component: PurchaseOrderDetailsComponent },
  { path: 'room-management', component: RoomManagementComponent },
  { path: 'tenant-management', component: TenantManagementComponent },
  { path: 'payment-management', component: PaymentManagementComponent },
  { path: 'maintenance-management', component: MaintenanceManagementComponent },
  { path: 'expenses-management', component: ExpensesManagementComponent },
  { path: 'room-type-management', component: RoomTypeManagementComponent },
  { path: 'floors-management', component: FloorsManagementComponent },
  { path: 'beds-management', component: BedsManagementComponent },
  { path: 'amenities-management', component: AmenitiesManagementComponent },
  { path: 'maintenance-category', component: MaintenanceCategoryComponent },
  { path: 'expenses-category', component: ExpensesCategoryComponent },
  { path: 'menu-list', component: MenuListComponent },
   { path: 'inventory-dashboard', component: InventoryDashboardComponent },
  { path: 'inventory-unit', component: InventoryUnitsComponent },
  { path: 'inventory-items', component: InventoryItemsComponent },
  { path: 'inventory-items-categories', component: InventoryItemsCategoriesComponent },
  { path: 'inventory-stocks', component: InventoryStocksComponent },
  { path: 'inventory-movements', component: InventoryMovementsComponent },
  { path: 'inventory-purchase-orders', component: InventoryPurchaseOrdersComponent },
  { path: 'inventory-suppliers', component: InventorySuppliersComponent },
  { path: 'inventory-reports', component: InventoryReportsComponent },
  { path: 'inventory-settings', component: InventorySettingsComponent },
  { path: 'subscription-packages', component: SubscriptionPackagesComponent },
   { path: 'subscription-packages-modal', component: SubscriptionPackagesModalComponent },
    { path: 'subscription-billing-history', component: SubscriptionBillingHistoryComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
