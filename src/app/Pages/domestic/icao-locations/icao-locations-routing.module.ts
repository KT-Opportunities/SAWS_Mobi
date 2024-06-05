import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IcaoLocationsComponent } from './icao-locations.component';

const routes: Routes = [
  {
    path: '',
    component: IcaoLocationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IcaoLocationsRoutingModule {}
