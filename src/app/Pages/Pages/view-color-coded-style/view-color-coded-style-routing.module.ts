import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewColorCodedStylePage } from './view-color-coded-style.page';

const routes: Routes = [
  {
    path: '',
    component: ViewColorCodedStylePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewColorCodedStylePageRoutingModule {}
