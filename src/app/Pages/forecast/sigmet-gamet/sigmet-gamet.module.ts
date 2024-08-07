import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { sigmetGametRoutingModule } from './sigmet-gamet-routing.module';

import { SigmetGametComponent } from './sigmet-gamet.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    sigmetGametRoutingModule,
    SharedModule
],
  declarations: [SigmetGametComponent]
})
export class sigmetGametPageModule {}
