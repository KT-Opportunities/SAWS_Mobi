import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TakeOffDataComponent } from './take-off-data.component';



const routes: Routes = [
  {
    path: '',
    component: TakeOffDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakeOffDataRoutingModule {}
