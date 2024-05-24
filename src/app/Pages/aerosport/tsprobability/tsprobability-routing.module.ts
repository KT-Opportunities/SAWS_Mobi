import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TSProbabilityPage } from './tsprobability.page';

const routes: Routes = [
  {
    path: '',
    component: TSProbabilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TSProbabilityPageRoutingModule {}
