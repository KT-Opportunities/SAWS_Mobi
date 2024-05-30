import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SportGraphMapComponent } from './sport-graph-map.component';

const routes: Routes = [
  {
    path: '',
    component: SportGraphMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportGraphMapRoutingModule {}
