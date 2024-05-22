import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KwazulNatalPage } from './kwazul-natal.page';

const routes: Routes = [
  {
    path: '',
    component: KwazulNatalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KwazulNatalPageRoutingModule {}
