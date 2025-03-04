import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '../material/material.module';
import { EnCommonTableComponent } from './en-common-table/en-common-table.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    EnCommonTableComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule
  ],
  exports: [SidenavComponent,HeaderComponent]
})
export class SharedModule { }
