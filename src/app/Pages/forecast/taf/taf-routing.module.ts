import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TafComponent } from './taf.component';

const routes: Routes = [
  {
    path: '',
    component: TafComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TafRoutingModule {}
