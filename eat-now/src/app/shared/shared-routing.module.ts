import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnCommonTableComponent } from './en-common-table/en-common-table.component';

const routes: Routes = [
  { path: 'ctsearch/:id', component: EnCommonTableComponent },
  { path: 'ctsearch', component: EnCommonTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
