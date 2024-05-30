import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetarTafRecentComponent } from './metar-taf-recent.component';

const routes: Routes = [
  {
    path: '',
    component: MetarTafRecentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetarTafRecentRoutingModule { }
