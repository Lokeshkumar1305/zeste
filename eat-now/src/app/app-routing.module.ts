import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

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
    path: 'uam',
    loadChildren: () => import('./uam/uam.module').then(m => m.UamModule),
    data: { breadcrumb: 'IAM' } // Enable breadcrumbs with a label
  },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), data: { breadcrumb: false } },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}