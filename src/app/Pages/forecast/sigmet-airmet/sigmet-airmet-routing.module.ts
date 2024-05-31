import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigmetAirmetComponent } from './sigmet-airmet.component';

const routes: Routes = [
  {
    path: '',
    component: SigmetAirmetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class sigmetAirmetRoutingModule {}
