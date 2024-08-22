import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TSProbabilityRoutingModule } from './tsprobability-routing.module';
import { TSProbabilityComponent } from './tsprobability.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TSProbabilityRoutingModule,
  ],
  declarations: [TSProbabilityComponent],
})
export class TSProbabilityModule {}
