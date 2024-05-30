import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetarComponent } from './metar.component';

const routes: Routes = [
  {
    path: '',
    component: MetarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetarRoutingModule { }
