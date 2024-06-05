import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WindsChartsComponent } from './winds-charts.component';

const routes: Routes = [
  {
    path: '',
    component: WindsChartsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WindsChartsRoutingModule {}
