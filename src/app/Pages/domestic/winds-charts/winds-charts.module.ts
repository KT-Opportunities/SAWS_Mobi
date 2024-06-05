import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WindsChartsRoutingModule } from './winds-charts-routing.module';
import { WindsChartsComponent } from './winds-charts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WindsChartsRoutingModule
  ],
  declarations: [WindsChartsComponent]
})
export class WindsChartsModule {}
