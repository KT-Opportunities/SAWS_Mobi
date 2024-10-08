import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynopticAnalysisPageRoutingModule } from './synoptic-analysis-routing.module';

import { SynopticAnalysisPage } from './synoptic-analysis.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SynopticAnalysisPageRoutingModule
  ],
  declarations: [SynopticAnalysisPage],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SynopticAnalysisPageModule {}
