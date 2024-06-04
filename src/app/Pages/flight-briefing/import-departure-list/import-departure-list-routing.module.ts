import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportDepartureListComponent } from './import-departure-list.component';

const routes: Routes = [
  {
    path: '',
    component: ImportDepartureListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportDepartureListRoutingModule { }
