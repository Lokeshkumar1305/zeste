import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ThemeConfigComponent } from './features/config/theme-config/theme-config.component';
import { SystemConfigComponent } from './features/config/system-config/system-config.component';
import { ProductConfigComponent } from './features/config/product-config/product-config.component';
import { PaymentConfigComponent } from './features/config/payment-config/payment-config.component';
import { DynamicInputsComponent } from './features/config/dynamic-inputs/dynamic-inputs.component';

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule),
    data: { breadcrumb: false } // Not part of app nav
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    data: { breadcrumb: false } // Hide login/reset etc.
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    title: 'Home',
    data: { breadcrumb: 'Home' }
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    data: { breadcrumb: 'Core' }
  },
  {
    path: 'features/config',
    children: [
      { path: 'theme-config', component: ThemeConfigComponent, data: { breadcrumb: 'Theme Config' } },
      { path: 'system-config', component: SystemConfigComponent, data: { breadcrumb: 'System Config' } },
      { path: 'product-config', component: ProductConfigComponent, data: { breadcrumb: 'Product Config' } },
      { path: 'payment-config', component: PaymentConfigComponent, data: { breadcrumb: 'Payment Integration' } },
      { path: 'dynamic-inputs', component: DynamicInputsComponent, data: { breadcrumb: 'Dynamic Inputs' } },
    ]
  },
  {
    path: 'uam',
    loadChildren: () => import('./uam/uam.module').then(m => m.UamModule),
    data: { breadcrumb: 'IAM' } // Enable breadcrumbs with a label
  },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), data: { breadcrumb: false } },
  //   { path: '', redirectTo: 'auth/landing-page', pathMatch: 'full' },
  // { path: '**', redirectTo: 'auth/landing-page' }
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }