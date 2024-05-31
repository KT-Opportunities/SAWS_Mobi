import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedSigmentAirmetRoutingModule } from './color-coded-sigment-airmet-routing.module';
import { ColorCodedSigmentAirmetComponent } from './color-coded-sigment-airmet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedSigmentAirmetRoutingModule
  ],
  declarations: [ColorCodedSigmentAirmetComponent]
})
export class ColorCodedSigmentAirmetModule {}
