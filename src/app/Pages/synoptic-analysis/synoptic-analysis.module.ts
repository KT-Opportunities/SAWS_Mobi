import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynopticAnalysisPageRoutingModule } from './synoptic-analysis-routing.module';

import { SynopticAnalysisPage } from './synoptic-analysis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SynopticAnalysisPageRoutingModule
  ],
  declarations: [SynopticAnalysisPage]
})
export class SynopticAnalysisPageModule {}
