import { NgModule } from '@angular/core';
import { CloudCoverComponent } from './cloud-cover.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CloudCoverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CloudCoverRoutingModule { }
