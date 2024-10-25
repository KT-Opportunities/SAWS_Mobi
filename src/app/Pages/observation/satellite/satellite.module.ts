import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SatelliteRoutingModule } from './satellite-routing.module';
import { SatelliteComponent } from './satellite.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SatelliteRoutingModule
  ],
  declarations: [SatelliteComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SatelliteModule { }
