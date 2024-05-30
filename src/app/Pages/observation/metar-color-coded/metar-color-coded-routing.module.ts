import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetarColorCodedComponent } from './metar-color-coded.component';

const routes: Routes = [
  {
    path: '',
    component: MetarColorCodedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetarColorCodedRoutingModule { }
