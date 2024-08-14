import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObservationPageRoutingModule } from './observation-routing.module';

import { ObservationPage } from './observation.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObservationPageRoutingModule,
    SharedModule
  ],
  declarations: [ObservationPage],
  providers: [DatePipe]
})
export class ObservationPageModule {}
