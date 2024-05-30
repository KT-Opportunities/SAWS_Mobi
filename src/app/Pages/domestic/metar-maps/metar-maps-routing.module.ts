import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetarMapsComponent } from './metar-maps.component';



const routes: Routes = [
  {
    path: '',
    component: MetarMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetarMapsRoutingModule {}
