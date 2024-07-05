import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSymbolPage } from './view-symbol.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSymbolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSymbolPageRoutingModule {}
