import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LowLevelWindProfileComponent } from './low-level-wind-profile.component';

const routes: Routes = [
  {
    path: '',
    component: LowLevelWindProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LowLevelWindProfileRoutingModule {}
