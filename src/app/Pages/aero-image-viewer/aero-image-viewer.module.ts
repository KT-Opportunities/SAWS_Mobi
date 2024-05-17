import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AeroImageViewerPageRoutingModule } from './aero-image-viewer-routing.module';

import { AeroImageViewerPage } from './aero-image-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AeroImageViewerPageRoutingModule
  ],
  declarations: [AeroImageViewerPage]
})
export class AeroImageViewerPageModule {}
