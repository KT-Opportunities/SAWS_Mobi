import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedTafRoutingModule } from './color-coded-taf-routing.module';

import { ColorCodedTafComponent } from './color-coded-taf.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedTafRoutingModule,
    SharedModule
],
  declarations: [ColorCodedTafComponent],
  providers: [DatePipe]
})
export class ColorCodedTafModule {}
