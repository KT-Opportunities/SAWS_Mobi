import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageBrowserComponent } from './image-browser.component';

const routes: Routes = [
  {
    path: '',
    component: ImageBrowserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageBrowserRoutingModule { }
 