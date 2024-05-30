import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherMapComponent } from './weather-map.component';

const routes: Routes = [
  {
    path: '',
    component: WeatherMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherMapRoutingModule { }
