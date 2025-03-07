import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutletOnboardingComponent } from './outlet-onboarding/outlet-onboarding.component';
import { MerchantStaffOnboardingComponent } from './merchant-staff-onboarding/merchant-staff-onboarding.component';

const routes: Routes = [
  { path: 'outlet-onboarding', component: OutletOnboardingComponent },
  { path: 'merchant-staff-onboarding', component: MerchantStaffOnboardingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
