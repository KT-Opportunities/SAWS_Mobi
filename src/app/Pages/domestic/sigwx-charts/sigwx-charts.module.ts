import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SigwxChartsRoutingModule } from './sigwx-charts-routing.module';
import { SigwxChartsComponent } from './sigwx-charts.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigwxChartsRoutingModule
  ],
  declarations: [SigwxChartsComponent]
})
export class SigwxChartsModule {}
