import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorCodedWarningsRoutingModule } from './color-coded-warnings-routing.module';

import { ColorCodedWarningsComponent } from './color-coded-warnings.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorCodedWarningsRoutingModule,
    SharedModule
],
  declarations: [ColorCodedWarningsComponent],
  providers: [DatePipe]
})
export class ColorCodedWarningsModule {}
