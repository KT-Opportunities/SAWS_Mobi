import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDecodedPage } from './view-decoded.page';

const routes: Routes = [
  {
    path: '',
    component: ViewDecodedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDecodedPageRoutingModule {}
