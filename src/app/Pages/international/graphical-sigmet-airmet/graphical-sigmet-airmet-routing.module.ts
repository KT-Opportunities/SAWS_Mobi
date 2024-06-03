import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphicalSigmetAirmetComponent } from './graphical-sigmet-airmet.component';

const routes: Routes = [
  {
    path: '',
    component: GraphicalSigmetAirmetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphicalSigmetAirmetRoutingModule { }
 