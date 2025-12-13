import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';


const routes: Routes = [
  { path: 'roles', component: RolesComponent, data: { breadcrumb: 'Roles' } },
  { path: 'users', component: UsersComponent, data: { breadcrumb: 'Users' } },
  { path: 'role-details', component: RoleDetailsComponent, data: { breadcrumb: 'Role Details' } },
    { path: 'user-details', component: UserDetailsComponent, data: { breadcrumb: 'User Details' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UamRoutingModule {}