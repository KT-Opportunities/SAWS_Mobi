import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GraphicalSigmetAirmetRoutingModule } from './graphical-sigmet-airmet-routing.module';
import { GraphicalSigmetAirmetComponent } from './graphical-sigmet-airmet.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    SharedModule,
    GraphicalSigmetAirmetRoutingModule
  ],
  declarations: [GraphicalSigmetAirmetComponent],
})
export class GraphicalSigmetAirmetModule {}
