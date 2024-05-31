import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TSProbabilityComponent } from './tsprobability.component';

const routes: Routes = [
  {
    path: '',
    component: TSProbabilityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TSProbabilityRoutingModule {}
