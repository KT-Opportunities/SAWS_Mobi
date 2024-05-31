import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TSProbabilityRoutingModule } from './tsprobability-routing.module';
import { TSProbabilityComponent } from './tsprobability.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TSProbabilityRoutingModule,
  ],
  declarations: [TSProbabilityComponent],
})
export class TSProbabilityModule {}
