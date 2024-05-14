import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynopticAnalysisPage } from './synoptic-analysis.page';

const routes: Routes = [
  {
    path: '',
    component: SynopticAnalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SynopticAnalysisPageRoutingModule {}
