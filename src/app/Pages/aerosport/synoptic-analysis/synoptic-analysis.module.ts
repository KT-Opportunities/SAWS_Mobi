import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynopticAnalysisPageRoutingModule } from './synoptic-analysis-routing.module';

import { SynopticAnalysisPage } from './synoptic-analysis.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPanZoomModule } from 'ngx-panzoom';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SynopticAnalysisPageRoutingModule,
    NgxPanZoomModule
  ],
  declarations: [SynopticAnalysisPage]
})
export class SynopticAnalysisPageModule {}
