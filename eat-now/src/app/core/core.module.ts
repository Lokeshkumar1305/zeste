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


@NgModule({
  declarations: [
    OutletOnboardingComponent,
    MerchantStaffOnboardingComponent,
    OutletsComponent
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
