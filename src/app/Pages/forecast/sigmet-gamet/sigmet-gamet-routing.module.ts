import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigmetGametComponent } from './sigmet-gamet.component';

const routes: Routes = [
  {
    path: '',
    component: SigmetGametComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class sigmetGametRoutingModule {}
