import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridWindsPage } from './grid-winds.page';

const routes: Routes = [
  {
    path: '',
    component: GridWindsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GridWindsPageRoutingModule {}
