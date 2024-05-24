import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HarmonizedGridPageRoutingModule } from './harmonized-grid-routing.module';

import { HarmonizedGridPage } from './harmonized-grid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HarmonizedGridPageRoutingModule
  ],
  declarations: [HarmonizedGridPage]
})
export class HarmonizedGridPageModule {}
