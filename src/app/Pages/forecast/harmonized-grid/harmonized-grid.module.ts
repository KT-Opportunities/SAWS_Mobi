import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HarmonizedGridPageRoutingModule } from './harmonized-grid-routing.module';

import { HarmonizedGridPage } from './harmonized-grid.page';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HarmonizedGridPageRoutingModule,
    SharedModule
],
  declarations: [HarmonizedGridPage]
})
export class HarmonizedGridPageModule {}
