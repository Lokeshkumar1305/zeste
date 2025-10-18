import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'shared', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule), },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'core', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), },
  { path: 'uam', loadChildren: () => import('./uam/uam.module').then(m => m.UamModule), canActivate: [authGuard] },
  // { path: 'common', loadChildren: () => import('./common-library/common-library.module').then(m => m.CommonLibraryModule), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
