import { NgModule } from '@angular/core';
import { GpmComponent } from './gpm.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: GpmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpmRoutingModule { }
