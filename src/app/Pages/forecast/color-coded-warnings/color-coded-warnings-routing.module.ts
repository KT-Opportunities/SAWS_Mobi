import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorCodedWarningsComponent } from './color-coded-warnings.component';

const routes: Routes = [
  {
    path: '',
    component: ColorCodedWarningsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorCodedWarningsRoutingModule {}
