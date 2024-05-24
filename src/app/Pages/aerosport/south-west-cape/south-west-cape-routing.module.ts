import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SouthWestCapePage } from './south-west-cape.page';

const routes: Routes = [
  {
    path: '',
    component: SouthWestCapePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SouthWestCapePageRoutingModule {}
