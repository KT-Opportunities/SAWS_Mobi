import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HarmonizedGridPage } from './harmonized-grid.page';

const routes: Routes = [
  {
    path: '',
    component: HarmonizedGridPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HarmonizedGridPageRoutingModule {}
