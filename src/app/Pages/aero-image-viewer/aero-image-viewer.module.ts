import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HammerModule } from '@angular/platform-browser';
import { AeroImageViewerPageRoutingModule } from './aero-image-viewer-routing.module';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { AeroImageViewerPage } from './aero-image-viewer.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgxImageZoomModule,
    HammerModule,
    NgxPanZoomModule,
    Ng2ImgMaxModule,
    PinchZoomModule,

    AeroImageViewerPageRoutingModule,
  ],
  declarations: [AeroImageViewerPage],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AeroImageViewerPageModule {}
