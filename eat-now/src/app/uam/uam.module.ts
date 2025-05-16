import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { UamRoutingModule } from './uam-routing.module';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { SharedRoutingModule } from '../shared/shared-routing.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    RolesComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    UamRoutingModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
    SharedRoutingModule
  ]
})
export class UamModule { }
