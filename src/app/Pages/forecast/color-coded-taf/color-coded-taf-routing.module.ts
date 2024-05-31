import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorCodedTafComponent } from './color-coded-taf.component';

const routes: Routes = [
  {
    path: '',
    component: ColorCodedTafComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorCodedTafRoutingModule {}
