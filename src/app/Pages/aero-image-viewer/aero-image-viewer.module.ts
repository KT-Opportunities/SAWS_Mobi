import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HammerModule } from '@angular/platform-browser';
import { AeroImageViewerPageRoutingModule } from './aero-image-viewer-routing.module';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { AeroImageViewerPage } from './aero-image-viewer.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,

    HammerModule,
    NgxPanZoomModule,

    AeroImageViewerPageRoutingModule,
  ],
  declarations: [AeroImageViewerPage],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AeroImageViewerPageModule {}
