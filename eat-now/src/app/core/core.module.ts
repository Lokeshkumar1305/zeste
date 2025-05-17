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

@NgModule({
  declarations: [
    OutletOnboardingComponent,
    MerchantStaffOnboardingComponent,
    OutletsComponent,
    StaffOnboardingComponent,
    StaffOnboardingGetAllComponent,
    AreaComponent,
    TableComponent,
    AreaTableModalComponent
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
    SharedRoutingModule
  ],

  providers: [],

})
export class CoreModule { }
