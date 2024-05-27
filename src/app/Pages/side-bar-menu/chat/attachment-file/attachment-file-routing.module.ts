import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttachmentFilePage } from './attachment-file.page';

const routes: Routes = [
  {
    path: '',
    component: AttachmentFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttachmentFilePageRoutingModule {}
