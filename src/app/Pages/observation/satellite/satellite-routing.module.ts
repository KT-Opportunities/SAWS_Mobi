import { NgModule } from '@angular/core';
import { SatelliteComponent } from './satellite.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SatelliteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SatelliteRoutingModule { }
