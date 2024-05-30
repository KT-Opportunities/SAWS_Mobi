import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigwxChartsComponent } from './sigwx-charts.component';

const routes: Routes = [
  {
    path: '',
    component: SigwxChartsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigwxChartsRoutingModule {}
