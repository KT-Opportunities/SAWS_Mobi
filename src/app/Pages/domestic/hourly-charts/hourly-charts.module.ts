import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HourlyChartsRoutingModule } from './hourly-charts-routing.module';
import { HourlyChartsComponent } from './hourly-charts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HourlyChartsRoutingModule
  ],
  declarations: [HourlyChartsComponent]
})
export class HourlyChartsModule {}
