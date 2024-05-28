import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetarRecentComponent } from './metar-recent.component';

const routes: Routes = [
  {
    path: '',
    component: MetarRecentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetarRecentRoutingModule { }
