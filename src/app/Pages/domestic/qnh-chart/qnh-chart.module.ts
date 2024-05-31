import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QnhChartRoutingModule } from './qnh-chart-routing.module';

import { QnhChartComponent } from './qnh-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QnhChartRoutingModule
  ],
  declarations: [QnhChartComponent]
})
export class QnhChartModule {}
