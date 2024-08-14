import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QnhChartRoutingModule } from './qnh-chart-routing.module';

import { QnhChartComponent } from './qnh-chart.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    QnhChartRoutingModule
  ],
  declarations: [QnhChartComponent]
})
export class QnhChartModule {}
