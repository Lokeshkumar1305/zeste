import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'Home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'core', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), canActivate: [authGuard] },
  { path: 'common', loadChildren: () => import('./common-library/common-library.module').then(m => m.CommonLibraryModule), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
