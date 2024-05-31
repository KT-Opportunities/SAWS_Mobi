import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedTafRoutingModule } from './color-coded-taf-routing.module';

import { ColorCodedTafComponent } from './color-coded-taf.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedTafRoutingModule
  ],
  declarations: [ColorCodedTafComponent]
})
export class ColorCodedTafModule {}
