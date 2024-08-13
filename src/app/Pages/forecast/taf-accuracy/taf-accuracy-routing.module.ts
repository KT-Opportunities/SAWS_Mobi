import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TafAccuracyPage } from './taf-accuracy.page';

const routes: Routes = [
  {
    path: '',
    component: TafAccuracyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TafAccuracyPageRoutingModule {}
