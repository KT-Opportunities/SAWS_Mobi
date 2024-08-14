import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetarMapsRoutingModule } from './metar-maps-routing.module';
import { MetarMapsComponent } from './metar-maps.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MetarMapsRoutingModule
  ],
  declarations: [MetarMapsComponent]
})
export class MetarMapsModule {}
