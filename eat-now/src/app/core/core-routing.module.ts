import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutletOnboardingComponent } from './outlet-onboarding/outlet-onboarding.component';

const routes: Routes = [
  { path: 'outlet-onboarding', component: OutletOnboardingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
