import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SatelliteRoutingModule } from './satellite-routing.module';
import { SatelliteComponent } from './satellite.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SatelliteRoutingModule
  ],
  declarations: [SatelliteComponent]
})
export class SatelliteModule { }
