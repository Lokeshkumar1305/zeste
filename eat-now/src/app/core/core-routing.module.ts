import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutletOnboardingComponent } from './outlet-onboarding/outlet-onboarding.component';
import { MerchantStaffOnboardingComponent } from './merchant-staff-onboarding/merchant-staff-onboarding.component';
import { StaffOnboardingComponent } from './staff-onboarding/staff-onboarding.component';
import { StaffOnboardingGetAllComponent } from './staff-onboarding-get-all/staff-onboarding-get-all.component';
import { OutletsComponent } from './outlets/outlets.component';
import { AreaComponent } from './area/area.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  { path: 'outlet-onboarding', component: OutletOnboardingComponent },
  { path: 'merchant-staff-onboarding', component: MerchantStaffOnboardingComponent },
  { path: 'staff-onboarding', component: StaffOnboardingComponent },
  { path: 'staff-onboarding-getAll', component: StaffOnboardingGetAllComponent },
  { path: 'outlet-getAll', component: OutletsComponent },
  { path: 'area', component:AreaComponent },
  { path: 'table', component: TableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
