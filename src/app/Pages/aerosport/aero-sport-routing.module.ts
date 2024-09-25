import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AeroSportPage } from './aero-sport.page';

const routes: Routes = [
  {
    path: '',
    component: AeroSportPage,
  },
  {
    path: 'cloud-fore-cast',
    loadChildren: () =>
      import('./cloud-fore-cast/cloud-fore-cast.module').then(
        (m) => m.CloudForeCastModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroSportPageRoutingModule {}
