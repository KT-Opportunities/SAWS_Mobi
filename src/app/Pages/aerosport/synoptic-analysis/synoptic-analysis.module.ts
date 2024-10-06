import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynopticAnalysisPageRoutingModule } from './synoptic-analysis-routing.module';

import { SynopticAnalysisPage } from './synoptic-analysis.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PinchZoomModule,
    SynopticAnalysisPageRoutingModule
  ],
  declarations: [SynopticAnalysisPage]
})
export class SynopticAnalysisPageModule {}
