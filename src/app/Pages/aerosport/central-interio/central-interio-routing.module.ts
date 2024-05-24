import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentralInterioPage } from './central-interio.page';

const routes: Routes = [
  {
    path: '',
    component: CentralInterioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentralInterioPageRoutingModule {}
