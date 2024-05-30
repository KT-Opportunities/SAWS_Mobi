import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetarMapsRoutingModule } from './metar-maps-routing.module';
import { MetarMapsComponent } from './metar-maps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetarMapsRoutingModule
  ],
  declarations: [MetarMapsComponent]
})
export class MetarMapsModule {}
