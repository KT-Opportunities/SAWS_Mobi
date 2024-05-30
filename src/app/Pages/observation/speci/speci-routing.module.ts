import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeciComponent } from './speci.component';

const routes: Routes = [
  {
    path: '',
    component: SpeciComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeciRoutingModule { }
