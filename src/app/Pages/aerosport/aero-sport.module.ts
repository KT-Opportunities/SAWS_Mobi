import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AeroSportPageRoutingModule } from './aero-sport-routing.module';

import { AeroSportPage } from './aero-sport.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AeroSportPageRoutingModule,
    SharedModule
  ],
  declarations: [AeroSportPage]
})
export class AeroSportPageModule {}
