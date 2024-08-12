import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SigmetAirmetRoutingModule } from './sigmet-airmet-routing.module';
import { SigmetAirmetComponent } from './sigmet-airmet.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigmetAirmetRoutingModule,
    SharedModule
  ],
  declarations: [SigmetAirmetComponent],
  providers: [DatePipe]
})
export class SigmetAirmetModule {}
