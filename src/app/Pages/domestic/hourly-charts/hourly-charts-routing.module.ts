import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HourlyChartsComponent } from './hourly-charts.component';

const routes: Routes = [
  {
    path: '',
    component: HourlyChartsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HourlyChartsRoutingModule {}
