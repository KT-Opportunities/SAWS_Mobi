import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HumidityComponent } from './humidity.component';

const routes: Routes = [
  {
    path: '',
    component: HumidityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumidityRoutingModule { }
 