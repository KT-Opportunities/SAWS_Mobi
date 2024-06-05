import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IcaoLocationsRoutingModule } from './icao-locations-routing.module';
import { IcaoLocationsComponent } from './icao-locations.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IcaoLocationsRoutingModule
  ],
  declarations: [IcaoLocationsComponent]
})
export class IcaoLocationsModule {}
