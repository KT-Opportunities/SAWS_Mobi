import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentralInteriorComponent } from './central-interior.component';

const routes: Routes = [
  {
    path: '',
    component: CentralInteriorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentralInteriorRoutingModule {}
