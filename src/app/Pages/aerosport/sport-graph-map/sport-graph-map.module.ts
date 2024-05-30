import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SportGraphMapRoutingModule } from './sport-graph-map-routing.module';
import { SportGraphMapComponent } from './sport-graph-map.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SportGraphMapRoutingModule
  ],
  declarations: [SportGraphMapComponent]
})
export class SportGraphMapModule {}
