import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RadarRoutingModule } from './radar-routing.module';
import { RadarComponent } from './radar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RadarRoutingModule
  ],
  declarations: [RadarComponent]
})
export class RadarModule { }
