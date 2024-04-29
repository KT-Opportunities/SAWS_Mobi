import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageViewrPage } from './image-viewr.page';

const routes: Routes = [
  {
    path: '',
    component: ImageViewrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageViewrPageRoutingModule {}
