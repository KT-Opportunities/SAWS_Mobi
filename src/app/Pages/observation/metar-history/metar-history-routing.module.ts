import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetarHistoryComponent } from './metar-history.component';

const routes: Routes = [
  {
    path: '',
    component: MetarHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetarHistoryRoutingModule { }
