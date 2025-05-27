import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { OutletOnboardingComponent } from './outlet-onboarding/outlet-onboarding.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material/material.module';
import { MerchantStaffOnboardingComponent } from './merchant-staff-onboarding/merchant-staff-onboarding.component';
import { SharedRoutingModule } from '../shared/shared-routing.module';
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
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from './menu/menu.component';
import { MenuModalComponent } from './menu-modal/menu-modal.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    // BrowserModule,
    // AppRoutingModule,
    FormsModule,
    // BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
    SharedRoutingModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
   
  ],

  providers: [],

})
export class CoreModule { }
