import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedSigmentAirmetRoutingModule } from './color-coded-sigment-airmet-routing.module';
import { ColorCodedSigmentAirmetComponent } from './color-coded-sigment-airmet.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedSigmentAirmetRoutingModule,
    SharedModule
],
  declarations: [ColorCodedSigmentAirmetComponent],
  providers: [DatePipe]
})
export class ColorCodedSigmentAirmetModule {}
