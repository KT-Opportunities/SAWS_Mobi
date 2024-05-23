import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridMaximumPage } from './grid-maximum.page';

const routes: Routes = [
  {
    path: '',
    component: GridMaximumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GridMaximumPageRoutingModule {}
