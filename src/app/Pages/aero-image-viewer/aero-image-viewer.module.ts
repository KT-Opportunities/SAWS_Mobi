import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HammerModule } from '@angular/platform-browser';
import { AeroImageViewerPageRoutingModule } from './aero-image-viewer-routing.module';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { AeroImageViewerPage } from './aero-image-viewer.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgxPanZoomModule,
    NgxImageZoomModule,
    HammerModule,

    AeroImageViewerPageRoutingModule,
  ],
  declarations: [AeroImageViewerPage],
})
export class AeroImageViewerPageModule {}
