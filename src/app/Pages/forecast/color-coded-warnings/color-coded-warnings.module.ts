import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedWarningsRoutingModule } from './color-coded-warnings-routing.module';

import { ColorCodedWarningsComponent } from './color-coded-warnings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedWarningsRoutingModule
  ],
  declarations: [ColorCodedWarningsComponent]
})
export class ColorCodedWarningsModule {}
