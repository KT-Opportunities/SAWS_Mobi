import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TafAccuracyPageRoutingModule } from './taf-accuracy-routing.module';

import { TafAccuracyPage } from './taf-accuracy.page';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TafAccuracyPageRoutingModule,
    SharedModule
],
  declarations: [TafAccuracyPage]
})
export class TafAccuracyPageModule {}
