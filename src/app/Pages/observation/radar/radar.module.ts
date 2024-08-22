import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RadarRoutingModule } from './radar-routing.module';
import { RadarComponent } from './radar.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RadarRoutingModule
  ],
  declarations: [RadarComponent]
})
export class RadarModule { }
