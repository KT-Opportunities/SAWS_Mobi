import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CloudForeCastComponent } from './cloud-fore-cast.component';

const routes: Routes = [
  {
    path: '',
    component: CloudForeCastComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CloudForeCastPageRoutingModule {}
