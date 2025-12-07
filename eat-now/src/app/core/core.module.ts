import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreRoutingModule } from './core-routing.module';
import { SharedRoutingModule } from '../shared/shared-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { OutletOnboardingComponent } from './outlet-onboarding/outlet-onboarding.component';
import { MerchantStaffOnboardingComponent } from './merchant-staff-onboarding/merchant-staff-onboarding.component';
import { OutletsComponent } from './outlets/outlets.component';
import { StaffOnboardingComponent } from './staff-onboarding/staff-onboarding.component';
import { StaffOnboardingGetAllComponent } from './staff-onboarding-get-all/staff-onboarding-get-all.component';
import { AreaComponent } from './area/area.component';
import { TableComponent } from './table/table.component';
import { AreaTableModalComponent } from './area-table-modal/area-table-modal.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { StockMomentComponent } from './stock-moment/stock-moment.component';
import { ItemsComponent } from './items/items.component';
import { ItemsModalComponent } from './items-modal/items-modal.component';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';
import { SupplierModalComponent } from './supplier-modal/supplier-modal.component';
import { StockModalComponent } from './stock-modal/stock-modal.component';
import { MenuComponent } from './menu/menu.component';
import { MenuModalComponent } from './menu-modal/menu-modal.component';
import { CategoryComponent } from './category/category.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { BillingComponent } from './billing/billing.component';
import { BillSlipComponent } from './bill-slip/bill-slip.component';
import { RoomManagementComponent } from './room-management/room-management.component';
import { RoomManagementModalComponent } from './room-management-modal/room-management-modal.component';
import { TenantManagementComponent } from './tenant-management/tenant-management.component';
import { TenantManagementModalComponent } from './tenant-management-modal/tenant-management-modal.component';
import { PaymentManagementComponent } from './payment-management/payment-management.component';
import { PaymentManagementModalComponent } from './payment-management-modal/payment-management-modal.component';
import { MaintenanceManagementComponent } from './maintenance-management/maintenance-management.component';
import { ExpensesManagementComponent } from './expenses-management/expenses-management.component';
import { ExpensesManagementModalComponent } from './expenses-management-modal/expenses-management-modal.component';
import { RoomTypeManagementComponent } from './room-type-management/room-type-management.component';
import { RoomTypeManagementModalComponent } from './room-type-management-modal/room-type-management-modal.component';
import { BedsManagementComponent } from './beds-management/beds-management.component';
import { BedsManagementModalComponent } from './beds-management-modal/beds-management-modal.component';
import { FloorsManagementComponent } from './floors-management/floors-management.component';
import { FloorsManagementModalComponent } from './floors-management-modal/floors-management-modal.component';

/* ---------- NEW COMPONENT ---------- */
import { AmenitiesManagementModalComponent } from './amenities-management-modal/amenities-management-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AmenitiesManagementComponent } from './amenities-management/amenities-management.component';
import { MaintenanceCategoryComponent } from './maintenance-category/maintenance-category.component';
import { MaintenanceManagementModalComponent } from './maintenance-management-modal/maintenance-management-modal.component';
import { MaintenanceCategoryModalComponent } from './maintenance-category-modal/maintenance-category-modal.component';
import { ExpensesCategoryComponent } from './expenses-category/expenses-category.component';
import { ExpensesCategoryModalComponent } from './expenses-category-modal/expenses-category-modal.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { InventoryUnitsComponent } from './inventory-units/inventory-units.component';
import { InventoryItemsComponent } from './inventory-items/inventory-items.component';
import { InventoryItemsCategoriesComponent } from './inventory-items-categories/inventory-items-categories.component';
import { InventoryStocksComponent } from './inventory-stocks/inventory-stocks.component';
import { InventoryMovementsComponent } from './inventory-movements/inventory-movements.component';
import { InventoryPurchaseOrdersComponent } from './inventory-purchase-orders/inventory-purchase-orders.component';
import { InventorySuppliersComponent } from './inventory-suppliers/inventory-suppliers.component';
import { InventoryReportsComponent } from './inventory-reports/inventory-reports.component';
import { InventorySettingsComponent } from './inventory-settings/inventory-settings.component';
import { SubscriptionPackagesComponent } from './subscription-packages/subscription-packages.component';
import { SubscriptionPackagesModalComponent } from './subscription-packages-modal/subscription-packages-modal.component';
import { InventoryUnitsPopupComponent } from './inventory-units-popup/inventory-units-popup.component';
import { InventoryItemsModalComponent } from './inventory-items-modal/inventory-items-modal.component';
import { InventoryItemsCategoriesModalComponent } from './inventory-items-categories-modal/inventory-items-categories-modal.component';
import { InventoryStocksModalComponent } from './inventory-stocks-modal/inventory-stocks-modal.component';
import { InventoryMovementsModalComponent } from './inventory-movements-modal/inventory-movements-modal.component';
import { InventoryPurchaseOrdersModalComponent } from './inventory-purchase-orders-modal/inventory-purchase-orders-modal.component';
import { InventorySuppliersModalComponent } from './inventory-suppliers-modal/inventory-suppliers-modal.component';
import { SubscriptionBillingHistoryComponent } from './subscription-billing-history/subscription-billing-history.component';





@NgModule({
  declarations: [
    OutletOnboardingComponent,
    MerchantStaffOnboardingComponent,
    OutletsComponent,
    StaffOnboardingComponent,
    StaffOnboardingGetAllComponent,
    AreaComponent,
    TableComponent,
    AreaTableModalComponent,
    PurchaseOrdersComponent,
    SuppliersComponent,
    StockMomentComponent,
    ItemsComponent,
    ItemsModalComponent,
    PurchaseOrderDetailsComponent,
    SupplierModalComponent,
    StockModalComponent,
    MenuComponent,
    MenuModalComponent,
    CategoryComponent,
    CategoryModalComponent,
    BillingComponent,
    BillSlipComponent,
    RoomManagementComponent,
    RoomManagementModalComponent,
    TenantManagementComponent,
    TenantManagementModalComponent,
    PaymentManagementComponent,
    PaymentManagementModalComponent,
    MaintenanceManagementComponent,
    ExpensesManagementComponent,
    ExpensesManagementModalComponent,
    RoomTypeManagementComponent,
    RoomTypeManagementModalComponent,
    BedsManagementComponent,
    BedsManagementModalComponent,
    FloorsManagementComponent,
    FloorsManagementModalComponent,
    AmenitiesManagementModalComponent,
    AmenitiesManagementComponent,
    MaintenanceCategoryComponent,
 MaintenanceManagementModalComponent,
 MaintenanceCategoryModalComponent,
 ExpensesCategoryComponent,
 ExpensesCategoryModalComponent,
 MenuListComponent,
 InventoryDashboardComponent,
 InventoryUnitsComponent,
 InventoryItemsComponent,
 InventoryItemsCategoriesComponent,
 InventoryStocksComponent,
 InventoryMovementsComponent,
 InventoryPurchaseOrdersComponent,
 InventorySuppliersComponent,
 InventoryReportsComponent,
 InventorySettingsComponent,
 SubscriptionPackagesComponent,
 SubscriptionPackagesModalComponent,
 InventoryUnitsPopupComponent,
 InventoryItemsModalComponent,
 InventoryItemsCategoriesModalComponent,
 InventoryStocksModalComponent,
 InventoryMovementsModalComponent,
 InventoryPurchaseOrdersModalComponent,
 InventorySuppliersModalComponent,
 SubscriptionBillingHistoryComponent
 
 
 


  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,   // optional but useful for mat-form-field
    HttpClientModule,
    SharedModule,
    MaterialModule,        // your custom material wrapper (keep if you have one)

    /* ---- Material modules (keep only once) ---- */
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatChipsModule,

  ],
  exports: [
    /* Export the modal so it can be used as an entryComponent from other modules */
    AmenitiesManagementModalComponent,
  ],
})
export class CoreModule {}