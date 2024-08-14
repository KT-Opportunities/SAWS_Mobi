import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LowLevelWindProfileRoutingModule } from './low-level-wind-profile-routing.module';
import { LowLevelWindProfileComponent } from './low-level-wind-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LowLevelWindProfileRoutingModule
  ],
  declarations: [LowLevelWindProfileComponent]
})
export class LowLevelWindProfileModule {}
