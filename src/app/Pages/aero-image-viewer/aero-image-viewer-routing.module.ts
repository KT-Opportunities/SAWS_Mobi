import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AeroImageViewerPage } from './aero-image-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: AeroImageViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroImageViewerPageRoutingModule {}
