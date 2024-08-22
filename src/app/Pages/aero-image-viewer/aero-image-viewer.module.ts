import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AeroImageViewerPageRoutingModule } from './aero-image-viewer-routing.module';

import { AeroImageViewerPage } from './aero-image-viewer.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AeroImageViewerPageRoutingModule
  ],
  declarations: [AeroImageViewerPage]
})
export class AeroImageViewerPageModule {}
