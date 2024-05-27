import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttachmentFilePageRoutingModule } from './attachment-file-routing.module';

import { AttachmentFilePage } from './attachment-file.page';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttachmentFilePageRoutingModule,
    MatDialogModule
  ],
  declarations: [AttachmentFilePage]
})
export class AttachmentFilePageModule {}
