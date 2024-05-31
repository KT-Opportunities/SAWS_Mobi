import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SigmetAirmetRoutingModule } from './sigmet-airmet-routing.module';
import { SigmetAirmetComponent } from './sigmet-airmet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigmetAirmetRoutingModule
  ],
  declarations: [SigmetAirmetComponent]
})
export class SigmetAirmetModule {}
