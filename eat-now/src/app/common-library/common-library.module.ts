import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonLibraryRoutingModule } from './common-library-routing.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';


@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    CommonLibraryRoutingModule
  ]
})
export class CommonLibraryModule { }
