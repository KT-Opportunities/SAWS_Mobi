import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QnhChartComponent } from './qnh-chart.component';




const routes: Routes = [
  {
    path: '',
    component: QnhChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QnhChartRoutingModule {}
