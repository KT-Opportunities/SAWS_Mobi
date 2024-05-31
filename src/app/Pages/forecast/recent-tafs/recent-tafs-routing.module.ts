import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentTafsComponent } from './recent-tafs.component';

const routes: Routes = [
  {
    path: '',
    component: RecentTafsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentTafsRoutingModule {}
