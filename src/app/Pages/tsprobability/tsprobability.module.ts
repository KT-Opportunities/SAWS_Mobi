import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TSProbabilityPageRoutingModule } from './tsprobability-routing.module';

import { TSProbabilityPage } from './tsprobability.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TSProbabilityPageRoutingModule
  ],
  declarations: [TSProbabilityPage]
})
export class TSProbabilityPageModule {}
