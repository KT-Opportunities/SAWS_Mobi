import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorCodedSigmentAirmetComponent } from './color-coded-sigment-airmet.component';

const routes: Routes = [
  {
    path: '',
    component: ColorCodedSigmentAirmetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorCodedSigmentAirmetRoutingModule {}
