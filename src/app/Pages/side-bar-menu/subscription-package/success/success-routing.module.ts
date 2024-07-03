import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { SuccessComponent } from './success.component';

const routes: Routes = [
  {
    path: '',
    component: SuccessComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessRoutingModule { }
